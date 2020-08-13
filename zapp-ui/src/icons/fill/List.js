import * as React from "react";

function SvgList(props) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <g data-name="Layer 2">
        <g data-name="list">
          <circle cx={4} cy={7} r={1} />
          <circle cx={4} cy={12} r={1} />
          <circle cx={4} cy={17} r={1} />
          <rect x={7} y={11} width={14} height={2} rx={0.94} ry={0.94} />
          <rect x={7} y={16} width={14} height={2} rx={0.94} ry={0.94} />
          <rect x={7} y={6} width={14} height={2} rx={0.94} ry={0.94} />
        </g>
      </g>
    </svg>
  );
}

export default SvgList;
