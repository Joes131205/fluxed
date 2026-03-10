import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/subareas/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/subareas/create"!</div>
}
