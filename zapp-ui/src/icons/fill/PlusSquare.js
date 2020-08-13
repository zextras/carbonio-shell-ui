import * as React from "react";

function SvgPlusSquare(props) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <g data-name="Layer 2">
        <path
          d="M18 3H6a3 3 0 00-3 3v12a3 3 0 003 3h12a3 3 0 003-3V6a3 3 0 00-3-3zm-3 10h-2v2a1 1 0 01-2 0v-2H9a1 1 0 010-2h2V9a1 1 0 012 0v2h2a1 1 0 010 2z"
          data-name="plus-square"
        />
      </g>
    </svg>
  );
}

export default SvgPlusSquare;
