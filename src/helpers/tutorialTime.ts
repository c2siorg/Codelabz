/**
 * Represents a single tutorial step.
 * Extend this interface if your step objects have additional fields.
 */
export interface Step {
  time: string | number;
}

/**
 * Calculates total time remaining from the current step to the end.
 *
 * @param steps       - Full array of tutorial steps
 * @param currentStep - Zero-based index of the active step
 * @returns           Total minutes remaining (including the current step)
 */
export const TutorialTimeRemaining = (
  steps: Step[],
  currentStep: number
): number => {
  const remainingSteps = steps.slice(currentStep); // slice, not splice — avoids mutating original array
  return remainingSteps.reduce(
    (total, step) => total + parseInt(String(step.time), 10),
    0
  );
};