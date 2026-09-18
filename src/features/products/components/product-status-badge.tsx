import { Badge } from '@/components/ui/badge'

/** Figma status colours: low-opacity green and red backgrounds. */
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
