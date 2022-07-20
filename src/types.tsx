import { number } from "prop-types";
import { CSSProperties, Dispatch, SetStateAction } from "react";
import { SemanticICONS } from "semantic-ui-react";

///// CONVENIENCE

// shorthand for the many setstate props being passed around
export type SetState<Type> = Dispatch<SetStateAction<Type>>;

export interface WindowSize {
  height: number;
  width: number;
}

///// DATA

export interface DataStatus {
  name: string;
}

export interface GatherSettings {
  name: string;
  subname: string;
  icon?: SemanticICONS;
  img?: string;
  cookbook: any;
  instructions: {
    [language: string]: Instruction;
  };
  importMap: {
    [name: string]: ImportSetting;
  };
}

export interface ImportSetting {
  data: string;
  idFields: string[];
}

//export interface Cookbook {}

export interface Instruction {
  title: string;
  introduction: string;
  fileHint: string;
  steps: InstructionStep[];
}

export interface InstructionStep {
  title: string;
  items: InstructionStepItem[];
}

export interface InstructionStepItem {
  text?: string;
  image?: string | string[];
  image_style?: CSSProperties;
}

///// SETTINGS

// Project settings (see useSettings) are JSON objects with a special
// format for working with translations. A value in the JSON can either be a
// string, in which case there are no translations. Or it can be an objects with
// a 'value' key that holds the value in the default language, and other keys for
// specific languages (e.g., NL, DE).
export interface TranslatedValueInput {
  value: string | number;
  [language: string]: string | number;
}

// When useSettings is used, the input JSON is transformed to a file where all values
// are objects with keys 'value' and 'trans'. Value is then always the default language value,
// and trans is the value of the selected language (which can also be the default). The
// idea is that .value should be used if values need to be stored (e.g., answer options), and
// trans should be used to display to users.
export interface TranslatedValue {
  value: string | number;
  trans: string;
}

///// QUESTIONS

export interface QuestionInput {
  type: "topItems" | "simpleQuestion";
  title: string | TranslatedValueInput;
  question: string | TranslatedValueInput;
  answers?: (string | TranslatedValueInput)[];
  intro?: string | TranslatedValueInput;
  data?: string;
  field?: string;
  top?: number;
  detail?: string;
  canAdd?: boolean;
  canAddIntro?: string | TranslatedValueInput;
}

export interface Question {
  type: "topItems" | "simpleQuestion";
  title: TranslatedValue;
  question: TranslatedValue;
  answers: TranslatedValue[];
  intro?: TranslatedValue;
  data?: TranslatedValue;
  field?: TranslatedValue;
  top?: TranslatedValue;
  detail?: TranslatedValue;
  canAdd?: TranslatedValue;
  canAddIntro?: TranslatedValue;
}

export interface QSimpleQuestion extends Question {}

export interface QTopItems extends Question {
  data: TranslatedValue;
  field: TranslatedValue;
  top: TranslatedValue;
  detail: TranslatedValue;
  canAdd: TranslatedValue;
  canAddIntro: TranslatedValue;
}

///// VALIDATION

export interface ValidationQuestion {
  question: TranslatedValue;
  answers: TranslatedValue[];
}

///// DashBoard

export interface TableColumn {
  name: string;
  width?: number;
  f?: (any) => any;
}

///// LOGGING
