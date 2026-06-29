export async function GET() {
  return Response.json({ status: "ok", repo_root: process.env.STUDIO_REPO_ROOT ?? "(mock)" });
}