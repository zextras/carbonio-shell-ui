import * as React from "react";

function SvgBoardCollapse(props) {
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
      <path
        d="M35.88 45.84v61.68h-5.16c-8.426 0-15.36-6.934-15.36-15.36V45.84h20.52zm71.64-10.08H15.36v-5.04c0-8.426 6.934-15.36 15.36-15.36h61.44c8.426 0 15.36 6.934 15.36 15.36v5.04zM84.918 83.507c1.972 1.984 1.972 5.235 0 7.219a5.122 5.122 0 01-7.271 0l-9.923-10.4c-1.939-1.978-1.939-5.19 0-7.168l10.752-10.4a5.121 5.121 0 013.584-1.638 5.12 5.12 0 013.635 8.755l-7.219 6.765 6.442 6.867zM45.96 45.84v61.68h46.2c8.426 0 15.36-6.934 15.36-15.36V45.84H45.96z"
        fillRule="nonzero"
      />
    </svg>
  );
}

export default SvgBoardCollapse;
