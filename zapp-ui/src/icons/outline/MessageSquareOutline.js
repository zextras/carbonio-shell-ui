import React from "react";

function SvgMessageSquareOutline(props) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <g data-name="Layer 2">
        <g data-name="message-square">
          <circle cx={12} cy={11} r={1} />
          <circle cx={16} cy={11} r={1} />
          <circle cx={8} cy={11} r={1} />
          <path d="M19 3H5a3 3 0 00-3 3v15a1 1 0 00.51.87A1 1 0 003 22a1 1 0 00.51-.14L8 19.14a1 1 0 01.55-.14H19a3 3 0 003-3V6a3 3 0 00-3-3zm1 13a1 1 0 01-1 1H8.55a3 3 0 00-1.55.43l-3 1.8V6a1 1 0 011-1h14a1 1 0 011 1z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgMessageSquareOutline;
