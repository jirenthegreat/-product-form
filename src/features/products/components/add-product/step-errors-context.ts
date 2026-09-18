import { createContext, useContext } from 'react'

/**
 * Whether to show errors for every field of the current step.
 * Set after a failed attempt to move on and cleared when the step changes, so the
 * user does not see red before typing anything.
 */
export const StepErrorsContext = createContext(false)

export const useShowAllErrors = () => useContext(StepErrorsContext)
