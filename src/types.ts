import { OptionsOrGroups } from "react-select";

export type Errors = {
  passengers?: string;
  date?: string;
  destinations?: Array<string | undefined>;
  origin?: string;
};
export type Option = { label: string; value: [number, number] };

export type Options = OptionsOrGroups<Option, { options: Option[] }>;
