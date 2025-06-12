import {
  Outlet,
  createRootRouteWithContext,
  Link,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import TanStackQueryLayout from "../integrations/tanstack-query/layout.tsx";

import type { QueryClient } from "@tanstack/react-query";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <nav className="flex gap-4 p-4 border-b mb-4">
        <Link to="/explore" className="[&.active]:font-bold">
          Explore
        </Link>
        <Link to="/pipeline" className="[&.active]:font-bold">
          Pipeline
        </Link>
        <Link to="/knowledge" className="[&.active]:font-bold">
          Knowledge Hub
        </Link>
      </nav>
      <Outlet />
      <TanStackRouterDevtools />
      <TanStackQueryLayout />
    </>
  ),
});
