import { createContext, useContext } from 'react'

/**
 * Czy pokazywać błędy wszystkich pól bieżącego kroku.
 * Ustawiane po nieudanej próbie przejścia dalej i zerowane przy zmianie kroku,
 * dzięki czemu użytkownik nie widzi czerwieni, zanim czegokolwiek nie wpisze.
 */
export const StepErrorsContext = createContext(false)

export const useShowAllErrors = () => useContext(StepErrorsContext)
