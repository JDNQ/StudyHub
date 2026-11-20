import { DocumentsStudio } from "@/components/documents-studio";
import { requireUser } from "@/lib/auth";
import { listDocuments } from "@/lib/documents/service";

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ doc?: string }>;
}) {
  const { doc: selectedDocId } = await searchParams;
  const { user, supabase } = await requireUser();
  const documents = await listDocuments(supabase, user.id);

  return (
    <DocumentsStudio
      initialDocuments={documents}
      initialSelectedId={selectedDocId ?? null}
    />
  );
}
