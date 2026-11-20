import type { SupabaseClient } from "@supabase/supabase-js";
import { ApiError } from "@/lib/api";
import { env } from "@/lib/env";
import { chunkText, extractPdfText } from "@/lib/pdf/extract";
import type { Document } from "@/lib/types/database";

const PDF_MIME = "application/pdf";

export function assertPdfFile(file: File) {
  const name = file.name.toLowerCase();
  const isPdf =
    file.type === PDF_MIME ||
    file.type === "application/x-pdf" ||
    name.endsWith(".pdf");

  if (!isPdf) {
    throw new ApiError(400, "INVALID_FILE_TYPE", "Only PDF files are allowed");
  }

  if (file.size <= 0) {
    throw new ApiError(400, "EMPTY_FILE", "File is empty");
  }

  if (file.size > env.maxPdfBytes) {
    throw new ApiError(
      400,
      "FILE_TOO_LARGE",
      `File exceeds max size of ${env.maxPdfBytes} bytes`,
    );
  }
}

function publicDocument(row: Document) {
  const { extracted_text: _text, ...rest } = row;
  return {
    ...rest,
    has_extracted_text: Boolean(row.extracted_text?.trim()),
    extracted_text_length: row.extracted_text?.length ?? 0,
  };
}

export async function listDocuments(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("documents")
    .select(
      "id, user_id, title, file_name, storage_path, file_type, file_size, status, error_message, created_at, updated_at, extracted_text",
    )
    .eq("user_id", userId)
    .neq("status", "deleted")
    .order("created_at", { ascending: false });

  if (error) throw new ApiError(500, "LIST_DOCUMENTS_FAILED", error.message);
  return (data as Document[]).map(publicDocument);
}

export async function getDocument(
  supabase: SupabaseClient,
  userId: string,
  documentId: string,
  options?: { includeText?: boolean },
) {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", documentId)
    .eq("user_id", userId)
    .neq("status", "deleted")
    .maybeSingle();

  if (error) throw new ApiError(500, "GET_DOCUMENT_FAILED", error.message);
  if (!data) throw new ApiError(404, "DOCUMENT_NOT_FOUND", "Document not found");

  const doc = data as Document;
  if (options?.includeText) {
    return doc;
  }
  return publicDocument(doc);
}

export async function getDocumentStatus(
  supabase: SupabaseClient,
  userId: string,
  documentId: string,
) {
  const { data, error } = await supabase
    .from("documents")
    .select("id, status, error_message, updated_at")
    .eq("id", documentId)
    .eq("user_id", userId)
    .neq("status", "deleted")
    .maybeSingle();

  if (error) throw new ApiError(500, "GET_STATUS_FAILED", error.message);
  if (!data) throw new ApiError(404, "DOCUMENT_NOT_FOUND", "Document not found");
  return data;
}

export async function uploadAndProcessDocument(params: {
  supabase: SupabaseClient;
  userId: string;
  file: File;
  title?: string;
}) {
  const { supabase, userId, file, title } = params;
  assertPdfFile(file);

  const documentId = crypto.randomUUID();
  const safeName = file.name.replace(/[^\w.\-()\s]/g, "_");
  const storagePath = `${userId}/${documentId}/${safeName}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(storagePath, buffer, {
      contentType: PDF_MIME,
      upsert: false,
    });

  if (uploadError) {
    throw new ApiError(500, "UPLOAD_FAILED", uploadError.message);
  }

  const { data: created, error: insertError } = await supabase
    .from("documents")
    .insert({
      id: documentId,
      user_id: userId,
      title: title?.trim() || file.name.replace(/\.pdf$/i, ""),
      file_name: file.name,
      storage_path: storagePath,
      file_type: PDF_MIME,
      file_size: file.size,
      status: "processing",
    })
    .select("*")
    .single();

  if (insertError) {
    await supabase.storage.from("documents").remove([storagePath]);
    throw new ApiError(500, "CREATE_DOCUMENT_FAILED", insertError.message);
  }

  try {
    const { text } = await extractPdfText(buffer);
    const chunks = chunkText(text);

    const { error: chunkError } = await supabase.from("document_chunks").insert(
      chunks.map((content, chunk_index) => ({
        document_id: documentId,
        chunk_index,
        content,
        metadata: { char_count: content.length },
      })),
    );

    if (chunkError) {
      throw new Error(chunkError.message);
    }

    const { data: ready, error: updateError } = await supabase
      .from("documents")
      .update({
        extracted_text: text,
        status: "ready",
        error_message: null,
      })
      .eq("id", documentId)
      .select("*")
      .single();

    if (updateError) throw new Error(updateError.message);
    return publicDocument(ready as Document);
  } catch (error) {
    const message =
      error instanceof ApiError
        ? error.message
        : error instanceof Error
          ? error.message
          : "Processing failed";

    await supabase
      .from("documents")
      .update({
        status: "failed",
        error_message: message,
      })
      .eq("id", documentId);

    if (error instanceof ApiError) throw error;
    throw new ApiError(422, "PROCESSING_FAILED", message);
  }
}

export async function softDeleteDocument(
  supabase: SupabaseClient,
  userId: string,
  documentId: string,
) {
  const { data, error } = await supabase
    .from("documents")
    .select("id, storage_path")
    .eq("id", documentId)
    .eq("user_id", userId)
    .neq("status", "deleted")
    .maybeSingle();

  if (error) throw new ApiError(500, "DELETE_LOOKUP_FAILED", error.message);
  if (!data) throw new ApiError(404, "DOCUMENT_NOT_FOUND", "Document not found");

  const { error: updateError } = await supabase
    .from("documents")
    .update({ status: "deleted", error_message: null })
    .eq("id", documentId)
    .eq("user_id", userId);

  if (updateError) {
    throw new ApiError(500, "DELETE_FAILED", updateError.message);
  }

  if (data.storage_path) {
    await supabase.storage.from("documents").remove([data.storage_path]);
  }

  return { id: documentId, deleted: true };
}
