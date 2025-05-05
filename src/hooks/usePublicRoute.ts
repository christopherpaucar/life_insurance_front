"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useRouteConfig } from "./useRouteConfig";

/**
 * Hook to mark the current route as public
 * Use this in any page component that should be publicly accessible
 */
export function usePublicRoute() {
  const pathname = usePathname();
  const { setRouteAsPublic } = useRouteConfig();

  useEffect(() => {
    if (pathname) {
      setRouteAsPublic(pathname);
    }
  }, [pathname, setRouteAsPublic]);
}

/**
 * Hook to mark specific routes as public
 * @param paths Array of paths to mark as public
 */
export function usePublicRoutes(paths: string[]) {
  const { setRouteAsPublic } = useRouteConfig();

  useEffect(() => {
    paths.forEach((path) => {
      setRouteAsPublic(path);
    });
  }, [paths, setRouteAsPublic]);
}
