export interface Command {
  testId: string;
  task: string;
  mode: string;
  at: string;
  commandA: string;
  commandB: string;
  commandC: string;
  commandD: string;
  commandE: string;
  commandF: string;
}

type RefId =
  | "author"
  | "authorEmail"
  | "title"
  | "reference"
  | "designPattern"
  | "example"
  // eslint-disable-next-line @typescript-eslint/ban-types
  | (string & {});

export interface RawReference {
  refId: RefId;
  value: string;
}

export type References = {
  [refId in RawReference["refId"]]: RawReference["value"];
};

export interface Test {
  testId: string;
  title: string;
  appliesTo: string;
  mode: string;
  task: string;
  setupScript: string;
  setupScriptDescription: string;
  refs: string;
  instructions: string;
  assertion1: string;
  assertion2: string;
  assertion3: string;
  assertion4: string;
  assertion5: string;
  assertion6: string;
  assertion7: string;
}
