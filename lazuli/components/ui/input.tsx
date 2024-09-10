import * as React from "react"

//Ce composant est un simple composant d'entrée qui peut être utilisé pour les formulaires.
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full px-3 py-2 rounded-md border border-blue-600 bg-blue-800 text-blue-100 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"