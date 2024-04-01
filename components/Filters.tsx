import { MeasureFilter, OperationType } from "@/types/filters";
import { MeasureGroups, MeasureType } from "@/types/measures";
import { measureNames } from "@/utils/measureNames";
import { MeasureStats } from "@/utils/stats";
import { TrashIcon, PlusIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import { useState } from "react";
import { OperationSelect } from "./OperationSelect";
import { Select } from "./Select";

interface Props {
  filters: MeasureFilter[];
  globalStats: Record<MeasureType, MeasureStats>;
  measures: MeasureGroups;
  setFilters: (filters: MeasureFilter[]) => void;
}

const ValueInput = ({
  filter,
  onChange,
}: {
  filter: MeasureFilter;
  onChange: (val: number) => void;
}) => {
  const [controlledValue, setControlledValue] = useState(
    `${filter.value || ""}`
  );
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={classNames(
        "rounded-md shadow-sm w-[5rem] ring-1 focus-within:ring-2 ml-2",
        {
          "focus-within:ring-pink-600 ring-pink-600": hasError,
          "focus-within:ring-violet-500 ring-slate-700": !hasError,
        }
      )}
    >
      <input
        type="text"
        name="filtervalue"
        id="filtervalue"
        value={controlledValue}
        onChange={(e) => {
          setControlledValue(e.target.value);
          setHasError(false);
        }}
        onBlur={() => {
          if (+controlledValue >= 0) {
            onChange(+controlledValue);
          } else {
            setHasError(true);
          }
        }}
        className="border-0 w-full bg-transparent py-1.5 pl-1 text-slate-50 sm:text-sm sm:leading-6 ring-0 focus:outline-none"
      />
    </div>
  );
};

export const Filters = ({
  filters,
  globalStats,
  measures,
  setFilters,
}: Props) => {
  return (
    <div className="flex flex-col mt-8">
      <div className="text-sm font-medium leading-6 text-gray-50">Filters</div>
      {filters.map((filter, index) => (
        <div
          key={index}
          className="border border-slate-800 p-3 bg-gray-900 rounded-md my-2"
        >
          <Select
            hideLabel
            measures={measures}
            selected={filter.type}
            onChange={(newType) => {
              const newFilters = [...filters];
              newFilters[index].type = newType;
              setFilters(newFilters);
            }}
          />
          {filter.type && (
            <div className="text-xs text-slate-400 my-1">
              &quot;{measureNames[filter.type]}&quot; ranges from{" "}
              <b>{globalStats[filter.type].low} to {globalStats[filter.type].high}</b>
            </div>
          )}
          <div className="flex items-center mt-2 w-full">
            <OperationSelect
              selected={filter.operation}
              onChange={(newType) => {
                const newFilters = [...filters];
                newFilters[index].operation = newType;
                setFilters(newFilters);
              }}
            />
            <ValueInput
              filter={filter}
              onChange={(newValue) => {
                const newFilters = [...filters];
                newFilters[index].value = newValue;
                setFilters(newFilters);
              }}
            />
            <button
              type="button"
              className="p-1 ml-auto opacity-60 hover:opacity-100 group focus:ring-2 ring-pink-600 focus:outline-none focus:opacity-100 rounded-md"
              onClick={() => {
                const newFilters = [...filters];
                newFilters.splice(index, 1);
                setFilters(newFilters);
              }}
              title="Delete filter"
            >
              <TrashIcon
                className="h-5 w-5 text-pink-700 group-hover:text-pink-600"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="p-1 mt-2 focus:ring-2 ring-violet-600 focus:outline-none hover:bg-violet-700 bg-slate-900 border border-violet-700 rounded-md flex items-center justify-center text-sm"
        onClick={() =>
          setFilters([
            ...(filters || []),
            { type: undefined, operation: OperationType[">"], value: 0 },
          ])
        }
      >
        <PlusIcon className="h-5 w-5 mr-1" aria-hidden="true" />
        <span>Add filter</span>
      </button>
    </div>
  );
};
