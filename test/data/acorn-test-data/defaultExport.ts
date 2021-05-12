import { StateMachine, StepFunction } from "./fakes";

const stepFn = StepFunction((c) => c.state((s) => s.task()));

/**
 * multi-line comment on multiple
 * lines of file
 *
 * @returns stepFunction
 */
export default StateMachine((s) => s.stepFunction(stepFn));

export const foo = "bar";
