import { Badge } from '@/components/ui/badge'

export function ProductStatusBadge({ isAvailable }: { isAvailable: boolean }) {
  return isAvailable ? <Badge variant="success">Dostępny</Badge> : <Badge variant="destructive">Niedostępny</Badge>
}
