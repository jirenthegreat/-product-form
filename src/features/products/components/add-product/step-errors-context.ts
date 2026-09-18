import { createContext, useContext } from "react";

export const StepErrorsContext = createContext(false);

export const useShowAllErrors = () => useContext(StepErrorsContext);
