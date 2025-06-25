import PropTypes from "prop-types";
import classNames from "classnames";

export const Card = ({ children, className = "" }) => {
  return (
    <div
      className={classNames(
        "rounded-xl shadow-md bg-white border border-gray-200",
        className
      )}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export const CardHeader = ({ children, className = "" }) => {
  return (
    <div className={classNames("px-6 pt-6", className)}>
      {children}
    </div>
  );
};

CardHeader.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export const CardContent = ({ children, className = "" }) => {
  return (
    <div className={classNames("px-6 pb-6", className)}>
      {children}
    </div>
  );
};

CardContent.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export const CardTitle = ({ children, className = "" }) => {
  return (
    <h2 className={classNames("text-xl font-semibold", className)}>
      {children}
    </h2>
  );
};

CardTitle.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
