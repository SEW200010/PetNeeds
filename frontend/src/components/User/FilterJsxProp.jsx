import React from "react";

/**
 * Utility component that filters out boolean `jsx` props from its children.
 * It clones the child element and removes the `jsx` prop if it is boolean.
 */
const FilterJsxProp = ({ children }) => {
  if (!React.isValidElement(children)) {
    return children;
  }

  const { jsx, ...restProps } = children.props;

  // Only remove jsx if it is boolean
  const filteredProps = typeof jsx === "boolean" ? restProps : children.props;

  return React.cloneElement(children, filteredProps);
};

export default FilterJsxProp;
