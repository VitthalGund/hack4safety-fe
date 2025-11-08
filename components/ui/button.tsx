import * as React from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "font-medium transition-all duration-200 rounded-lg",
          variant === "primary" && "bg-indigo-600 hover:bg-indigo-700 text-white",
          variant === "secondary" &&
            "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white",
          variant === "outline" &&
            "border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white",
          size === "sm" && "px-3 py-1.5 text-sm",
          size === "md" && "px-4 py-2 text-base",
          size === "lg" && "px-6 py-3 text-lg",
          className,
        )}
        {...props}
      />
    )
  },
)

Button.displayName = "Button"

export { Button }
