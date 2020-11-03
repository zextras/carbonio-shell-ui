import * as React from "react";

function SvgPin2(props) {
  return (
    <svg
      clipRule="evenodd"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit={2}
      viewBox="0 0 123 123"
      {...props}
    >
      <path
        d="M122.88 121.86L1.02 122.881-.001 1.021 121.859 0l1.021 121.86z"
        fill="none"
      />
      <path
        d="M60.941 15.746a37.588 37.588 0 00-26.81 11.577c-14.557 15.271-14.33 39.688.508 54.686l23.56 23.611a4.782 4.782 0 003.606 1.524 5.08 5.08 0 003.605-1.575l23.154-23.966c14.571-15.258 14.367-39.674-.457-54.686a37.237 37.237 0 00-27.166-11.171z"
        fillRule="nonzero"
      />
    </svg>
  );
}

export default SvgPin2;
