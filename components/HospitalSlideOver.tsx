import { Hospital, ServiceLevel } from "@/types/hospital";
import { Dialog, Transition } from "@headlessui/react";
import {
  StarIcon as StarIconOutline,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import classNames from "classnames";
import Image from "next/image";
import { Fragment } from "react";
import {
  FaArrowsRotate,
  FaBullseye,
  FaClock,
  FaComputer,
  FaFaceGrinBeam,
  FaShieldHalved,
  FaSkullCrossbones,
  FaTruckMedical,
  FaXRay,
} from "react-icons/fa6";
import type { IconType } from "react-icons";
interface Props {
  hospital: Hospital | null;
  open: boolean;
  setOpen: (val: boolean) => void;
  setHospital: () => void;
}

const serviceTitle: Record<string, string> = {
  emergencyServices: "Emergency",
  meetsCriteriaForPromotingInteroperabilityOfEhrs: "EHRS interop.",
  mortalityNationalComparison: "Mortality",
  safetyOfCareNationalComparison: "Safety",
  readmissionNationalComparison: "Readmission",
  patientExperienceNationalComparison: "Experience",
  effectivenessOfCareNationalComparison: "Effectiveness",
  timelinessOfCareNationalComparison: "Timeliness",
  efficientUseOfMedicalImagingNationalComparison: "Imaging",
};

const Service = ({
  Icon,
  propKey,
  serviceLevel,
}: {
  Icon: IconType;
  propKey: keyof Hospital;
  serviceLevel: ServiceLevel;
}) => (
  <div
    className={classNames(
      "flex min-w-[15rem] border items-center border-slate-700 rounded-md gap-3 pr-3 overflow-hidden"
    )}
  >
    <div
      className={classNames(
        "h-full w-[2rem] min-w-[2rem] flex items-center justify-center",
        {
          "from-emerald-600 to-transparent bg-gradient-to-br":
            serviceLevel === ServiceLevel["Above the national average"],
          "from-pink-800 to-transparent bg-gradient-to-br":
            serviceLevel === ServiceLevel["Below the national average"],
          "from-emerald-950 to-transparent bg-gradient-to-br":
            serviceLevel === ServiceLevel["Same as the national average"],
          "bg-slate-900":
            serviceLevel === ServiceLevel["Not Available"],
        }
      )}
    >
      <Icon size={16} />
    </div>
    <div className="text-slate-50 text-sm my-1 grow">
      {serviceTitle[propKey]}
    </div>
    <div className="text-xs uppercase font-light text-slate-400 whitespace-nowrap">
      {serviceLevel === ServiceLevel["Above the national average"] &&
        "Above avg."}
      {serviceLevel === ServiceLevel["Below the national average"] &&
        "Below avg."}
      {serviceLevel === ServiceLevel["Same as the national average"] &&
        "Average"}
      {serviceLevel === ServiceLevel["Not Available"] && "Not available"}
    </div>
  </div>
);

const YesNoService = ({
  Icon,
  propKey,
  hasService,
}: {
  Icon: IconType;
  propKey: keyof Hospital;
  hasService: boolean;
}) => (
  <div
    className={classNames(
      "flex border items-center justify-between border-slate-700 rounded-md gap-3 pr-3 overflow-hidden"
    )}
  >
    <div
      className={classNames(
        "h-full w-[2rem] min-w-[2rem] flex items-center justify-center",
        {
          "from-emerald-600 to-transparent bg-gradient-to-br": hasService,
          "from-pink-800 to-transparent bg-gradient-to-br": !hasService,
        }
      )}
    >
      <Icon size={16} />
    </div>
    <div className="text-slate-50 text-center text-sm my-1">
      {serviceTitle[propKey]}
    </div>
    <div className="text-xs uppercase font-light text-slate-400">
      {hasService ? "Yes" : "No"}
    </div>
  </div>
);

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
          <div className="ml-auto text-right">
            <div className="text-xl">{hospital.hospitalType}</div>
            <div className="text-xs text-slate-400">
              {hospital.hospitalOwnership}
            </div>
          </div>
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
        <div className="my-2 text-slate-200 text-sm">
          <div>{hospital.address}</div>
          <div>
            {hospital.city},{hospital.state} {hospital.zipCode}
          </div>
          <div>{hospital.phoneNumber}</div>
        </div>
        <div className="mt-6">Services</div>
        <div className="flex gap-2 mb-6 mt-1">
          <YesNoService
            Icon={FaTruckMedical}
            propKey="emergencyServices"
            hasService={hospital.emergencyServices === "Yes"}
          />
          <YesNoService
            Icon={FaComputer}
            propKey="meetsCriteriaForPromotingInteroperabilityOfEhrs"
            hasService={
              hospital.meetsCriteriaForPromotingInteroperabilityOfEhrs === "Y"
            }
          />
        </div>
        <div>National Comparisons</div>
        <div className="flex flex-wrap gap-2 mb-6 mt-1">
          <Service
            Icon={FaSkullCrossbones}
            propKey={"mortalityNationalComparison"}
            serviceLevel={hospital.mortalityNationalComparison}
          />
          <Service
            Icon={FaShieldHalved}
            propKey={"safetyOfCareNationalComparison"}
            serviceLevel={hospital.safetyOfCareNationalComparison}
          />
          <Service
            Icon={FaArrowsRotate}
            propKey={"readmissionNationalComparison"}
            serviceLevel={hospital.readmissionNationalComparison}
          />
          <Service
            Icon={FaFaceGrinBeam}
            propKey={"patientExperienceNationalComparison"}
            serviceLevel={hospital.patientExperienceNationalComparison}
          />
          <Service
            Icon={FaBullseye}
            propKey={"effectivenessOfCareNationalComparison"}
            serviceLevel={hospital.effectivenessOfCareNationalComparison}
          />
          <Service
            Icon={FaClock}
            propKey={"timelinessOfCareNationalComparison"}
            serviceLevel={hospital.timelinessOfCareNationalComparison}
          />
          <Service
            Icon={FaXRay}
            propKey="efficientUseOfMedicalImagingNationalComparison"
            serviceLevel={
              hospital.efficientUseOfMedicalImagingNationalComparison
            }
          />
        </div>
        {/*                             
                        <div>
                            Ownership
                            {
                                hospitalOwnership
                            }
                        </div>
                        
                        <div>
                            Surveys
                            {
                                numberOfCompletedSurveys
                                surveyResponseRatePercent
                                ...measures
                            }
                        </div> */}
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
