import { theme } from "@/styles/theme";
import { Bar, BarChart, ResponsiveContainer } from "recharts";

export interface BarChartPoint {
    id: string;
    value: number;
}

export const SimpleBarChart = ({ data }: { data: BarChartPoint[] }) => {
    if (!data || data.length < 2) {
        return <div className="text-sm text-slate-400 text-center">Select more data<br/>to render chart</div>
    }
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart width={150} height={40} data={data}>
        <Bar dataKey="value" fill={theme.high} />
      </BarChart>
    </ResponsiveContainer>
  );
};
