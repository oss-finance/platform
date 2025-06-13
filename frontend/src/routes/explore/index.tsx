import { NotebookEditor } from "@/components/custom/notebook-editor";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/explore/")({
  component: ExploreView,
});

function ExploreView() {
  return (
    <div className="h-full w-full">
      <NotebookEditor />
    </div>
  );
}
