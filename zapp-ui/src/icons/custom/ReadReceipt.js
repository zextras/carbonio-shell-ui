import * as React from "react";

function SvgReadReceipt(props) {
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
      <path d="M99.046 20.48c2.254 0 4.381.55 6.254 1.523L61.311 65.992 46.83 51.511a5.114 5.114 0 00-1.694-1.124 5.165 5.165 0 00-4.954.614 5.107 5.107 0 00-2.078 4.498 5.114 5.114 0 001.485 3.252l18.102 18.102a5.168 5.168 0 005.547 1.124 5.24 5.24 0 001.694-1.124l47.029-47.029c.441 1.337.679 2.766.679 4.25v54.732c0 7.503-6.091 13.594-13.594 13.594H23.834c-7.503 0-13.594-6.091-13.594-13.594V34.074c0-7.503 6.091-13.594 13.594-13.594h75.212z" />
    </svg>
  );
}

export default SvgReadReceipt;
