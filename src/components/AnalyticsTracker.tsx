"use client";
import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

function AnalyticsTrackerInner() {
  const pathname = usePathname();
  const search = useSearchParams();

  useEffect(() => {
    const fullPath = pathname + (search?.toString() ? `?${search.toString()}` : "");
    trackEvent("admin_page_view", { path: fullPath });
  }, [pathname, search]);

  return null;
}

export default function AnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <AnalyticsTrackerInner />
    </Suspense>
  );
}