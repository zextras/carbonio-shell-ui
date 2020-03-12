import React from "react";

function SvgToggleRight(props) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <g data-name="Layer 2">
        <g data-name="toggle-right">
          <circle cx={15} cy={12} r={1} />
          <path d="M15 5H9a7 7 0 000 14h6a7 7 0 000-14zm0 10a3 3 0 113-3 3 3 0 01-3 3z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgToggleRight;
