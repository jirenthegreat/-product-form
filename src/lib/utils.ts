// Komponenty shadcn/ui importują `cn` z pakietu `cn` (tak generuje CLI).
// Re-eksport pod aliasem z components.json, żeby w kodzie aplikacji był jeden import.
export { cn } from 'cn'
