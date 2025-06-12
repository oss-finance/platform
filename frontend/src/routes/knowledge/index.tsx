import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/knowledge/")({
  component: KnowledgeHub,
});

function KnowledgeHub() {
  return (
    <div>
      <h1>Knowledge Hub</h1>
      <p>
        This is the command center for managing the system's and your own
        knowledge base.
      </p>
    </div>
  );
}
