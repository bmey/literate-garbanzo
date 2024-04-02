import { theme } from "@/styles/theme";
import { Bar, BarChart, ResponsiveContainer } from "recharts";

export interface BarChartPoint {
    id: string;
    value: number;
}

export const SimpleBarChart = ({ data }: { data: BarChartPoint[] }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart width={150} height={40} data={data}>
        <Bar dataKey="value" fill={theme.high} />
      </BarChart>
    </ResponsiveContainer>
  );
};
