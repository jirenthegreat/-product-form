import { CircleCheckIcon } from 'lucide-react'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

function Toaster(props: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      icons={{ success: <CircleCheckIcon className="size-5 fill-success text-white" /> }}
      toastOptions={{
        classNames: {
          toast: '!gap-2 !rounded-md !p-4 !font-sans !shadow-toast',
          title: '!text-sm !font-medium',
          icon: '!size-5 !m-0',
        },
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'calc(var(--radius) - 2px)',
          '--width': '336px',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
