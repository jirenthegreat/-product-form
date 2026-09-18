import { CircleCheckIcon } from 'lucide-react'

import { Toaster } from '@/components/ui/sonner'
import { ProductsPage } from '@/features/products/components/products-page'

export default function App() {
  return (
    <>
      <ProductsPage />
      <Toaster
        position="bottom-right"
        offset={16}
        icons={{ success: <CircleCheckIcon className="size-5 fill-success text-white" /> }}
        toastOptions={{
          // Figma: toast width and shadow
          classNames: { toast: '!w-[336px] !gap-2 !rounded-md !p-4 !font-sans !shadow-toast', title: '!text-sm !font-medium' },
        }}
      />
    </>
  )
}
