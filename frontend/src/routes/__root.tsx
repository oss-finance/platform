import {
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import TanStackQueryLayout from "../integrations/tanstack-query/layout.tsx";

import type { QueryClient } from "@tanstack/react-query";
import { SidebarProvider } from "@/components/ui/sidebar.tsx";
import { SideBar } from "@/components/custom/side-bar.tsx";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      {/* Application */}
      <SidebarProvider>
        <SideBar />
        <Outlet />
      </SidebarProvider>

      {/* Devtools */}
      <TanStackRouterDevtools />
      <TanStackQueryLayout />
    </>
  ),
});
