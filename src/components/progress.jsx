import * as React from "react"
import PropTypes from "prop-types"

const Progress = React.forwardRef(({ className = "", value = 0, ...props }, ref) => (
  <div
    ref={ref}
    className={`relative h-4 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}
    {...props}
  >
    <div
      className="h-full w-full flex-1 bg-blue-600 transition-all duration-300"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </div>
))

Progress.displayName = "Progress"

Progress.propTypes = {
  className: PropTypes.string,
  value: PropTypes.number,
}

export { Progress }
