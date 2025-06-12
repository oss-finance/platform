import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/knowledge/')({
  component: KnowledgeHub,
})

function KnowledgeHub() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Knowledge Hub (AI's Brain)</h1>
      <p>This is the command center for managing the system's and your own knowledge base.</p>
    </div>
  )
} 