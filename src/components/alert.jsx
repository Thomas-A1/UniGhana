import * as React from "react"
import PropTypes from "prop-types"

const Alert = React.forwardRef(({ className = "", variant = "default", ...props }, ref) => {
  const variantClasses = {
    default: "bg-white text-gray-900 border-gray-200",
    destructive: "bg-red-50 text-red-900 border-red-200"
  }

  return (
    <div
      ref={ref}
      role="alert"
      className={`relative w-full rounded-lg border p-4 ${variantClasses[variant]} ${className}`}
      {...props}
    />
  )
})
Alert.displayName = "Alert"
Alert.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(["default", "destructive"]),
}

const AlertTitle = React.forwardRef(({ className = "", ...props }, ref) => (
  <h5
    ref={ref}
    className={`mb-1 font-medium leading-none tracking-tight ${className}`}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"
AlertTitle.propTypes = {
  className: PropTypes.string,
}

const AlertDescription = React.forwardRef(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`text-sm leading-relaxed ${className}`}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"
AlertDescription.propTypes = {
  className: PropTypes.string,
}

export { Alert, AlertTitle, AlertDescription }
