import { Toaster } from '@/components/ui/sonner'
import { ProductsPage } from '@/features/products/components/products-page'

export default function App() {
  return (
    <>
      <ProductsPage />
      <Toaster position="bottom-right" />
    </>
  )
}
