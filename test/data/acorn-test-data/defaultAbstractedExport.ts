import { StateMachine, StepFunction } from "./fakes";

const stepFn = StepFunction((c) => c.state((s) => s.task()));

/** multi-line comment on one line */
const sm = StateMachine((s) => s.stepFunction(stepFn));

export default sm;

export const foo = "bar";
