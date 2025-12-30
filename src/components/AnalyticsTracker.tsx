"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const search = useSearchParams();

  useEffect(() => {
    const fullPath = pathname + (search?.toString() ? `?${search.toString()}` : "");
    trackEvent("admin_page_view", { path: fullPath });
  }, [pathname, search]);

  return null;
}