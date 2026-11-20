import { jsonError, jsonOk } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { getDocumentStatus } from "@/lib/documents/service";
import { uuidSchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    uuidSchema.parse(id);
    const { user, supabase } = await requireUser();
    const status = await getDocumentStatus(supabase, user.id, id);
    return jsonOk({ status });
  } catch (error) {
    return jsonError(error);
  }
}
