"use client"

export const LoadingSpinner = ({ message = "Loading..." }: { message?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-96 gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-border"></div>
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin"></div>
      </div>
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  )
}
