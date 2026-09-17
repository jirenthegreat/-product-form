import { Badge } from '@/components/ui/badge'

/** Kolory statusu z Figmy: zielone i czerwone tło o niskim kryciu. */
export function ProductStatusBadge({ isAvailable }: { isAvailable: boolean }) {
  return isAvailable ? (
    <Badge variant="secondary" className="bg-success/10 text-success">
      Dostępny
    </Badge>
  ) : (
    <Badge variant="secondary" className="bg-destructive/10 text-destructive">
      Niedostępny
    </Badge>
  )
}
