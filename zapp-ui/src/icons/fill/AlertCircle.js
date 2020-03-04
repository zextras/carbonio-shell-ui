import React from "react";

function SvgAlertCircle(props) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <g data-name="Layer 2">
        <path
          d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 15a1 1 0 111-1 1 1 0 01-1 1zm1-4a1 1 0 01-2 0V8a1 1 0 012 0z"
          data-name="alert-circle"
        />
      </g>
    </svg>
  );
}

export default SvgAlertCircle;
