import { MeasureType } from "./measures";

export const OperationType = {
  ">": ">",
  ">=": ">=",
  "<": "<",
  "<=": "<=",
  "=": "=",
  "!=": "!=",
} as const;

export type OperationType = keyof typeof OperationType;

export interface MeasureFilter {
  type?: MeasureType;
  operation?: OperationType;
  value?: number;
}
