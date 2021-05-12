/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
export type FakeConfig = {
  // stepFunction(c: FakeConfig): FakeConfig;
  stepFunction(c?: FakeConfigurator): FakeConfig;
  // logging(c: FakeConfig): FakeConfig;
  logging(c?: FakeConfigurator): FakeConfig;
  // state(c: FakeConfig): FakeConfig;
  state(c?: FakeConfigurator): FakeConfig;
  task(c?: FakeConfigurator): FakeConfig;
  [key: string]: any;
};
export type FakeConfigurator = ((c: FakeConfig) => FakeConfig) | FakeConfig;

export function StepFunction(_c: FakeConfigurator) {
  return {} as FakeConfig;
}

export function StateMachine(_c: FakeConfigurator) {
  return {} as FakeConfig;
}

export function State(_c: FakeConfigurator) {
  return {} as FakeConfig;
}
