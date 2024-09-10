import * as React from "react"

//Ce composant est un simple composant de libellé qui peut être utilisé pour les formulaires.
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={`block text-sm font-medium text-gray-700 ${className}`}
        {...props}
      />
    )
  }
)

Label.displayName = "Label"