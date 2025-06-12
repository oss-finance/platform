import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/explore/')({
  component: ExploreView,
})

function ExploreView() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Explore View (Research Notebook)</h1>
      <p>This is the interactive notebook for research and discovery.</p>
    </div>
  )
} 