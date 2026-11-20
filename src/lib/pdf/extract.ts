import { PDFParse } from "pdf-parse";
import { ApiError } from "@/lib/api";

const MIN_TEXT_CHARS = 50;

export type ExtractedPdf = {
  text: string;
  pageCount: number;
};

export async function extractPdfText(buffer: Buffer): Promise<ExtractedPdf> {
  const parser = new PDFParse({ data: buffer });

  try {
    const result = await parser.getText();
    const text = (result.text ?? "").replace(/\u0000/g, "").trim();
    const pageCount =
      typeof result.total === "number"
        ? result.total
        : Array.isArray(result.pages)
          ? result.pages.length
          : 0;

    if (text.length < MIN_TEXT_CHARS) {
      throw new ApiError(
        422,
        "PDF_NO_TEXT",
        "Could not extract enough text from this PDF. Scanned PDFs without OCR are not supported in MVP.",
      );
    }

    return { text, pageCount };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      422,
      "PDF_PARSE_FAILED",
      "Failed to parse PDF. Please upload a valid text-based PDF.",
    );
  } finally {
    await parser.destroy().catch(() => undefined);
  }
}

/** Split long document text into overlapping chunks for later use. */
export function chunkText(
  text: string,
  chunkSize = 3000,
  overlap = 200,
): string[] {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= chunkSize) return [cleaned];

  const chunks: string[] = [];
  let start = 0;
  while (start < cleaned.length) {
    const end = Math.min(start + chunkSize, cleaned.length);
    chunks.push(cleaned.slice(start, end));
    if (end >= cleaned.length) break;
    start = Math.max(0, end - overlap);
  }
  return chunks;
}
