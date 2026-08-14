import { type ReactNode, Suspense } from 'react'

export function ToolSuspense({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900" />
        </div>
      }
    >
      {children}
    </Suspense>
  )
}
