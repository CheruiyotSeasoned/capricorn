import { useEffect, useState } from "react";
import { PeriodPicker } from "@/components/period-picker";
import { standardFormat } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import { PaymentsOverviewChart } from "./chart";

export function PaymentsOverviewClient({ timeFrame = "monthly", className }: { timeFrame?: string; className?: string; }) {
  const [data, setData] = useState<{ received: any[]; due: any[] } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`/api/loans/activity?timeFrame=${timeFrame}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setData(json.data);
        else throw new Error(json.error);
      })
      .catch(console.error);
  }, [timeFrame]);

  if (!data) return <div>Loading chart…</div>;

  const totalRepaid = data.received.reduce((sum, p) => sum + p.y, 0);
  const totalUpcoming = data.due.reduce((sum, p) => sum + p.y, 0);

  return (
    <div className={cn("…", className)}>
      {/* header + picker */}
      <PaymentsOverviewChart data={data} />
      {/* totals */}
      <dl>…</dl>
    </div>
  );
}
