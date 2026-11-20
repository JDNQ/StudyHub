import { ApiError, jsonError, jsonOk } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import {
  listDocuments,
  uploadAndProcessDocument,
} from "@/lib/documents/service";

export const runtime = "nodejs";

export async function GET() {
  try {
    const { user, supabase } = await requireUser();
    const documents = await listDocuments(supabase, user.id);
    return jsonOk({ documents });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    const { user, supabase } = await requireUser();
    const form = await request.formData();
    const file = form.get("file");
    const titleRaw = form.get("title");

    if (!(file instanceof File)) {
      throw new ApiError(400, "MISSING_FILE", "file is required");
    }

    const title =
      typeof titleRaw === "string" && titleRaw.trim()
        ? titleRaw.trim()
        : undefined;

    const document = await uploadAndProcessDocument({
      supabase,
      userId: user.id,
      file,
      title,
    });

    return jsonOk({ document }, 201);
  } catch (error) {
    return jsonError(error);
  }
}
