import { MeasureGroups, MeasureGroupType, MeasureType } from "@/types/measures";
import { measureGroupNames } from "@/utils/measureGroupNames";
import { measureNames } from "@/utils/measureNames";
import { Listbox, Transition } from "@headlessui/react";
import { CheckCircleIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import { Fragment } from "react";

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
  return (
    <Listbox value={selected || null} onChange={onChange}>
      {({ open }) => (
        <>
          <Listbox.Label className={classNames("block text-sm font-medium leading-6 text-gray-50 mb-2", { "hidden": hideLabel })}>
            Data source
          </Listbox.Label>
          <div className="relative">
            <Listbox.Button className="relative w-full cursor-default rounded-md bg-slate-900 py-1.5 pl-3 pr-10 text-left text-gray-50 shadow-sm ring-1 ring-inset ring-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 sm:text-sm sm:leading-6">
              <span className="flex items-center">
                <span className="ml-3 block truncate">
                  {selected ? measureNames[selected] : <>&nbsp;</>}
                </span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-slate-900 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
                  .map(([key, measureGroup]) => (
                    <Fragment key={key}>
                      <div className="flex items-center gap-1 border-t bg-slate-800 py-2 pl-2 uppercase text-xs text-slate-400 border-t-slate-700">
                        {measureGroupNames[key as MeasureGroupType]}
                      </div>
                      {Object.values(measureGroup).map((measure) => (
                        <Listbox.Option
                          key={measure.id}
                          className={({ active }) =>
                            classNames(
                              active
                                ? "bg-violet-600 text-white"
                                : "text-gray-50",
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
                        </Listbox.Option>
                      ))}
                    </Fragment>
                  ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
};
