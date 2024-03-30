import { OperationType } from "@/types/filters";
import { Listbox, Transition } from "@headlessui/react";
import { CheckCircleIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import { Fragment } from "react";

export const OperationSelect = ({
  selected,
  onChange,
}: {
  selected: OperationType | undefined;
  onChange: (val: OperationType) => void;
}) => {
  return (
    <Listbox value={selected || null} onChange={onChange}>
      {({ open }) => (
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-default rounded-md bg-slate-900 py-1.5 pl-3 pr-10 text-left text-gray-50 shadow-sm ring-1 ring-inset ring-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 sm:text-sm sm:leading-6">
            <span className="flex items-center">
              <span className="ml-3 block truncate">{selected ?? <>&nbsp;</>}</span>
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
              {Object.values(OperationType).map((type) => (
                <Listbox.Option
                  key={type}
                  className={({ active }) =>
                    classNames(
                      active ? "bg-violet-600 text-white" : "text-gray-50",
                      "relative cursor-default select-none py-2 pl-3 pr-9"
                    )
                  }
                  value={type}
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
                          {type}
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
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  );
};
