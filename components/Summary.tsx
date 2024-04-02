import { MeasureType } from "@/types/measures";
import { measureNames } from "@/utils/measureNames";
import { formatNumber } from "@/utils/numbers";
import { MeasureStats } from "@/utils/stats";

interface SummaryProps {
  chart: JSX.Element;
  selectedMeasure: MeasureType;
  polygonAggregate: MeasureStats | undefined;
  filteredGlobalStats: Record<MeasureType, MeasureStats>;
}

export const Summary = ({
  chart,
  selectedMeasure,
  polygonAggregate,
  filteredGlobalStats,
}: SummaryProps) => {
  return (
    <div className="h-[10rem] bg-slate-900 bg-gradient-to-br border-b border-b-slate-800 flex flex-col gap-1 px-5 py-3 justify-center overflow-y-clip overflow-x-auto max-w-[calc(100vw-20rem)]">
      <div className="text-sm text-slate-400 font-light">
        {measureNames[selectedMeasure]}
      </div>
      <div className="flex gap-5">
        <div className="rounded-lg p-5 flex flex-col items-center justify-center border border-slate-700 gap-1 min-w-32 relative">
          <div className="text-3xl text-emerald-500">
            {formatNumber(
              polygonAggregate?.count ??
                filteredGlobalStats[selectedMeasure].count
            )}
          </div>
          <div className="uppercase text-slate-300 text-xs tracking-tight">
            Hospitals
          </div>
          {!!polygonAggregate?.invalidCount && ( //TODO: show globalStats for invalid
            <div className="text-slate-500 text-[0.6rem] whitespace-nowrap bottom-2 absolute">
              {formatNumber(polygonAggregate.invalidCount)} no response
            </div>
          )}
        </div>
        <div className="rounded-lg p-5 flex flex-col items-center justify-center border border-slate-700 gap-1">
          <div className="text-3xl text-slate-200">
            {formatNumber(
              polygonAggregate?.avg ?? filteredGlobalStats[selectedMeasure].avg,
              {
                maximumFractionDigits: 2,
              }
            )}
          </div>
          <div className="uppercase text-slate-300 text-xs tracking-tight">
            Avg
          </div>
        </div>
        <div className="rounded-lg p-5 flex flex-col items-center justify-center border border-slate-700 gap-1">
          <div className="text-3xl text-slate-200">
            {formatNumber(
              polygonAggregate?.high ??
                filteredGlobalStats[selectedMeasure].high,
              {
                maximumFractionDigits: 2,
              }
            )}
          </div>
          <div className="uppercase text-slate-300 text-xs tracking-tight">
            High
          </div>
        </div>
        <div className="rounded-lg p-5 flex flex-col items-center justify-center border border-slate-700 gap-1">
          <div className="text-3xl text-slate-200">
            {formatNumber(
              polygonAggregate?.low ?? filteredGlobalStats[selectedMeasure].low,
              {
                maximumFractionDigits: 2,
              }
            )}
          </div>
          <div className="uppercase text-slate-300 text-xs tracking-tight">
            Low
          </div>
        </div>
        <div className="rounded-lg flex min-w-[10rem] flex-col items-center py-2 justify-center border border-slate-700 gap-1">
          {chart}
        </div>
      </div>
    </div>
  );
};
