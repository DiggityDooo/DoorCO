import { getSessionId } from "@/lib/session/cookie";
import { getSessionStore } from "@/lib/session";
import { ProfileClient } from "@/components/profile-client";

export const dynamic = "force-dynamic";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ doc?: string | string[] }>;
}) {
  const sessionId = await getSessionId();
  const fields = sessionId ? await getSessionStore().getFields(sessionId) : [];
  const { doc } = await searchParams;
  const initialDocId = typeof doc === "string" ? doc : "";
  return <ProfileClient initialFields={fields} initialDocId={initialDocId} />;
}
