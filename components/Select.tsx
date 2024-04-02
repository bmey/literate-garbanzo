import { MeasureGroups, MeasureGroupType, MeasureType } from "@/types/measures";
import { measureGroupNames } from "@/utils/measureGroupNames";
import { measureNames } from "@/utils/measureNames";
import { Combobox } from "@headlessui/react";
import { CheckCircleIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import { Fragment, useState } from "react";

export const Select = ({
  hideLabel = false,
  measures,
  selected,
  onChange,
}: {
  hideLabel?: boolean;
  measures: MeasureGroups;
  selected: MeasureType | undefined;
  onChange: (val: MeasureType) => void;
}) => {
  const [query, setQuery] = useState("");

  return (
    <Combobox as="div" value={selected || null} onChange={onChange}>
      <Combobox.Label
        className={classNames(
          "block text-sm font-medium leading-6 text-gray-50 mb-2",
          { hidden: hideLabel }
        )}
      >
        Data source
      </Combobox.Label>
      <div className="relative">
        <Combobox.Input
          className="w-full rounded-md border-0 bg-slate-900 py-1.5 truncate pl-3 pr-10 text-gray-50 shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-violet-500 sm:text-sm sm:leading-6"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(selected: MeasureType) =>
            selected ? measureNames[selected] : ""
          }
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>

        <Combobox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-slate-900 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {Object.entries(measures)
            .sort((a, b) => {
              if (a[0] === MeasureGroupType.H_STAR_RATING) {
                return -1;
              } else if (b[0] === MeasureGroupType.H_STAR_RATING) {
                return 1;
              } else if (a[0] === MeasureGroupType.H_HSP_RATING) {
                return -1;
              } else if (b[0] === MeasureGroupType.H_HSP_RATING) {
                return 1;
              }
              return 0;
            })
            .map(([key, measureGroup]) => {
              const groupItems = Object.values(measureGroup).filter(
                (measure) => !query || measureNames[measure.id].includes(query)
              );
              return (
                <Fragment key={key}>
                  {groupItems.length > 0 && (
                    <div className="flex items-center gap-1 border-t bg-slate-800 py-2 pl-2 uppercase text-xs text-slate-400 border-t-slate-700">
                      {measureGroupNames[key as MeasureGroupType]}
                    </div>
                  )}
                  {groupItems.map((measure) => (
                    <Combobox.Option
                      key={measure.id}
                      className={({ active }) =>
                        classNames(
                          active ? "bg-violet-600 text-white" : "text-gray-50",
                          "relative cursor-default select-none py-2 pl-3 pr-9"
                        )
                      }
                      value={measure.id}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex items-center">
                            <span
                              className={classNames(
                                selected ? "font-semibold" : "font-normal",
                                "ml-3 block"
                              )}
                            >
                              {measureNames[measure.id]}
                            </span>
                          </div>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? "text-white" : "text-violet-600",
                                "absolute inset-y-0 right-0 flex items-center pr-4"
                              )}
                            >
                              <CheckCircleIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Combobox.Option>
                  ))}
                </Fragment>
              );
            })}
        </Combobox.Options>
      </div>
    </Combobox>
  );
};
