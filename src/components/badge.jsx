import PropTypes from "prop-types";
import classNames from "classnames";

export const Badge = ({ children, variant = "default", className = "" }) => {
  const baseStyles = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";

  const variants = {
    default: "bg-blue-100 text-blue-800",
    outline: "border border-gray-300 text-gray-700 bg-white",
  };

  return (
    <span className={classNames(baseStyles, variants[variant], className)}>
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["default", "outline"]),
  className: PropTypes.string,
};
