import * as React from "react";

function SvgTag(props) {
  return (
    <svg
      viewBox="0 0 123 123"
      fillRule="evenodd"
      clipRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit={2}
      {...props}
    >
      <path fill="none" d="M0 0h122.88v122.88H0z" />
      <path d="M47.985 16.453c.37 0 .732.032 1.085.092a8.843 8.843 0 016.047 2.595l48.712 48.711c3.464 3.464 3.464 9.088 0 12.552l-23.426 23.426c-3.464 3.464-9.088 3.464-12.552 0L19.14 55.117a8.843 8.843 0 01-2.595-6.047 6.467 6.467 0 01-.092-1.085V22.883a6.434 6.434 0 016.43-6.43h25.102zm-9.501 16.991a5.043 5.043 0 015.04 5.04 5.043 5.043 0 01-5.04 5.04 5.043 5.043 0 01-5.04-5.04 5.042 5.042 0 015.04-5.04z" />
    </svg>
  );
}

export default SvgTag;
