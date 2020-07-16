import * as React from "react";

function SvgPerson(props) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <g data-name="Layer 2">
        <g data-name="person">
          <path d="M12 11a4 4 0 10-4-4 4 4 0 004 4zM18 21a1 1 0 001-1 7 7 0 00-14 0 1 1 0 001 1z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgPerson;
