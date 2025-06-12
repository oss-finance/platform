import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/explore/")({
  component: ExploreView,
});

function ExploreView() {
  return (
    <div>
      <h1>Explore View</h1>
      <p>This is the interactive notebook for research and discovery.</p>
    </div>
  );
}
