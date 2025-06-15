import { DataTable } from "@/components/custom/data-table";
import { CompanySheet } from "@/components/custom/company-sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";

export const Route = createFileRoute("/pipeline/")({
  component: PipelineView,
});

export type Company = {
  id: string;
  company: string;
  ticker: string;
  price: number;
  dailyChange: number;
  insightSummary: string;
  status: "Idea" | "Researching" | "Ready to Invest" | "Invested";
  pnl?: number;
};

const columns: ColumnDef<Company>[] = [
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => (
      <CompanySheet>
        <div className="cursor-pointer hover:underline">
          <div className="font-medium">{row.original.company}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.ticker}
          </div>
        </div>
      </CompanySheet>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => `$${row.original.price.toFixed(2)}`,
  },
  {
    accessorKey: "dailyChange",
    header: "Daily Change",
    cell: ({ row }) => {
      const change = row.original.dailyChange;
      const color = change >= 0 ? "text-green-600" : "text-red-600";
      return <span className={color}>{change.toFixed(2)}%</span>;
    },
  },
  {
    accessorKey: "insightSummary",
    header: "Latest Insight",
  },
  {
    accessorKey: "pnl",
    header: "P&L",
    cell: ({ row }) => {
      if (row.original.status === "Invested" && row.original.pnl) {
        const pnl = row.original.pnl;
        const color = pnl >= 0 ? "text-green-600" : "text-red-600";
        return (
          <span className={color}>
            {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}
          </span>
        );
      }
      return <span className="text-muted-foreground">-</span>;
    },
  },
];

const mockData: Company[] = [
  {
    id: "1",
    company: "Apple Inc.",
    ticker: "AAPL",
    price: 172.2,
    dailyChange: 1.2,
    insightSummary:
      "Strong quarterly earnings reported, looking into AI strategy.",
    status: "Invested",
    pnl: 1200.5,
  },
  {
    id: "2",
    company: "Microsoft Corp.",
    ticker: "MSFT",
    price: 340.5,
    dailyChange: -0.5,
    insightSummary: "New AI partnership with french startup Mistral AI.",
    status: "Invested",
    pnl: -250.75,
  },
  {
    id: "3",
    company: "NVIDIA Corp.",
    ticker: "NVDA",
    price: 850.0,
    dailyChange: 3.1,
    insightSummary:
      "High demand for new GPUs continues, but valuation is a concern.",
    status: "Researching",
  },
  {
    id: "4",
    company: "Alphabet Inc.",
    ticker: "GOOGL",
    price: 135.8,
    dailyChange: 0.8,
    insightSummary: "Gemini model shows promise, but execution risks remain.",
    status: "Researching",
  },
  {
    id: "5",
    company: "Tesla, Inc.",
    ticker: "TSLA",
    price: 180.3,
    dailyChange: -2.4,
    insightSummary: "Is the slump an opportunity or a warning sign?",
    status: "Idea",
  },
  {
    id: "6",
    company: "Amazon.com, Inc.",
    ticker: "AMZN",
    price: 130.1,
    dailyChange: 1.5,
    insightSummary:
      "AWS growth is re-accelerating, e-commerce margins improving.",
    status: "Ready to Invest",
  },
  {
    id: "7",
    company: "CrowdStrike Holdings",
    ticker: "CRWD",
    price: 300.7,
    dailyChange: 2.5,
    insightSummary: "Leader in endpoint security, but high competition.",
    status: "Idea",
  },
  {
    id: "8",
    company: "Palantir Technologies",
    ticker: "PLTR",
    price: 23.5,
    dailyChange: -1.1,
    insightSummary:
      "AIPcon showed strong interest, but government contracts are lumpy.",
    status: "Ready to Invest",
  },
];

function PipelineView() {
  const statuses: Company["status"][] = [
    "Idea",
    "Researching",
    "Ready to Invest",
    "Invested",
  ];

  const getDataForStatus = (status: Company["status"]) => {
    return mockData.filter((item) => item.status === status);
  };

  return (
    <div className="h-full w-full">
      <Tabs defaultValue="Idea" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {statuses.map((status) => (
            <TabsTrigger key={status} value={status} className="cursor-pointer">
              {status}
            </TabsTrigger>
          ))}
        </TabsList>
        {statuses.map((status) => (
          <TabsContent key={status} value={status}>
            <DataTable columns={columns} data={getDataForStatus(status)} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
