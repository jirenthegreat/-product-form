import { useState } from 'react'
import { PlusIcon } from 'lucide-react'

import { AddProductForm } from './add-product-form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import type { Product } from '@/features/products/model/types'

type AddProductDialogProps = {
  onCreated: (product: Product) => void
}

export function AddProductDialog({ onCreated }: AddProductDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          Dodaj produkt
        </Button>
      </DialogTrigger>
      <DialogContent
        // Nie zamykamy formularza przypadkowym kliknięciem w tło – łatwo stracić wpisane dane.
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader className="px-4 pt-6 pr-10 sm:h-16 sm:justify-center sm:border-b sm:pt-0">
          {/* Figma: tytuł 16px / medium (shadcn domyślnie daje 18px / semibold) */}
          <DialogTitle className="text-base font-medium">Dodaj nowy produkt</DialogTitle>
          <DialogDescription className="sr-only">Formularz dodawania produktu w trzech krokach</DialogDescription>
        </DialogHeader>
        {/*
          Radix odmontowuje zawartość po zamknięciu, więc każde otwarcie tworzy świeży formularz
          (krok 1, wartości domyślne) – to jest nasz „reset przy zamknięciu”.
        */}
        <AddProductForm
          onCreated={(product) => {
            onCreated(product)
            setOpen(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
