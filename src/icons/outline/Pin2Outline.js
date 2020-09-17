import * as React from "react";

function SvgPin2Outline(props) {
  return (
    <svg
      viewBox="0 0 123 123"
      fillRule="evenodd"
      clipRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit={2}
      {...props}
    >
      <path
        d="M122.88 121.859L1.021 122.88 0 1.021 121.859 0l1.021 121.859z"
        fill="none"
      />
      <path
        d="M60.941 15.746a37.588 37.588 0 00-26.81 11.577c-14.557 15.271-14.33 39.688.508 54.686l23.56 23.611a4.782 4.782 0 003.606 1.524 5.08 5.08 0 003.605-1.575l23.154-23.966c14.571-15.258 14.367-39.674-.457-54.686a37.237 37.237 0 00-27.166-11.171zm.66 79.059L41.849 74.901c-11.02-11.145-11.179-29.286-.355-40.622a27.586 27.586 0 0119.447-8.378 27.538 27.538 0 0119.803 8.175c11.058 11.135 11.195 29.322.305 40.621L61.601 94.805z"
        fillRule="nonzero"
      />
    </svg>
  );
}

export default SvgPin2Outline;
