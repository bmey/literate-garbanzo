import { Hospital } from "@/types/hospital";
import Image from "next/image";
import { Dialog, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  StarIcon as StarIconOutline,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import { Fragment } from "react";

interface Props {
  hospital: Hospital | null;
  open: boolean;
  setOpen: (val: boolean) => void;
  setHospital: () => void;
}

const DialogContent = ({ hospital }: { hospital: Hospital }) => {
  return (
    <div className="flex h-full flex-col overflow-y-scroll bg-slate-950 -mr-4 py-6 shadow-xl">
      <div className="px-4 sm:px-6">
        <Dialog.Title className="text-base font-semibold leading-6 text-slate-50">
          {hospital.facilityName || "Hospital details"}
        </Dialog.Title>
      </div>
      <div className="relative mt-6 flex-1 px-4 sm:px-6">
        <div className="flex items-center mb-6">
          {[1, 2, 3, 4, 5].map((starIndex) => (
            <Fragment key={starIndex}>
              {starIndex <= (hospital.hospitalOverallRating || 0) ? (
                <StarIcon className="h-7 w-7 ml-1" aria-hidden="true" />
              ) : (
                <StarIconOutline className="h-7 w-7 ml-1" aria-hidden="true" />
              )}
            </Fragment>
          ))}
          <div className="text-xl ml-5">{hospital.hospitalType}</div>
        </div>
        <div className="h-52 w-full">
          <Image
            src="/stock-hospital.jpeg"
            width={500}
            height={250}
            className="object-cover w-full h-full"
            alt="hospital"
          />
        </div>
      </div>
    </div>
  );
};

export const HospitalSlideOver = ({
  hospital,
  open,
  setOpen,
  setHospital,
}: Props) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={setHospital}
        >
          <div className="fixed inset-0 bg-slate-900 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                      <button
                        type="button"
                        className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => setOpen(false)}
                      >
                        <span className="absolute -inset-2.5" />
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  {hospital && <DialogContent hospital={hospital} />}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
