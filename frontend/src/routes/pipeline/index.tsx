import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/pipeline/")({
  component: PipelineView,
});

function PipelineView() {
  return (
    <div>
      <h1>Pipeline View</h1>
      <p>This is the structured management view for tracked companies.</p>
    </div>
  );
}
