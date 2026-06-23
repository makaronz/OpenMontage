import { PlaceholderPage } from "@/components/placeholder-page";

type PipelineDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PipelineDetailPage({
  params,
}: PipelineDetailPageProps) {
  const { id } = await params;

  return (
    <PlaceholderPage
      title={`Pipeline: ${id}`}
      description="Pipeline schema, stages, and artifact contracts will render here."
      phase="Phase 2"
    />
  );
}
