import * as React from "react";

function SvgTag(props) {
  return (
    <svg
      clipRule="evenodd"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit={2}
      viewBox="0 0 123 123"
      {...props}
    >
      <path fill="none" d="M0 0h122.88v122.88H0z" />
      <path d="M74.895 16.453c-.37 0-.732.032-1.085.092a8.843 8.843 0 00-6.047 2.595L19.051 67.851c-3.464 3.464-3.464 9.088 0 12.552l23.426 23.426c3.464 3.464 9.088 3.464 12.552 0l48.711-48.712a8.843 8.843 0 002.595-6.047c.06-.353.092-.715.092-1.085V22.883a6.434 6.434 0 00-6.43-6.43H74.895zm9.501 16.991a5.043 5.043 0 00-5.04 5.04 5.043 5.043 0 005.04 5.04 5.043 5.043 0 005.04-5.04 5.042 5.042 0 00-5.04-5.04z" />
    </svg>
  );
}

export default SvgTag;
