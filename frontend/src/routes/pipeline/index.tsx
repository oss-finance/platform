import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/pipeline/')({
  component: PipelineView,
})

function PipelineView() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Pipeline View (Management Hub)</h1>
      <p>This is the structured management view for tracked companies.</p>
    </div>
  )
} 