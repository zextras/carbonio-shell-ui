import * as React from "react";

function SvgSmileOutline(props) {
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
      <path fill="none" d="M0 0h122.88v122.88H0z" />
      <path
        d="M61.44 10.24c-28.087 0-51.2 23.113-51.2 51.2s23.113 51.2 51.2 51.2 51.2-23.113 51.2-51.2-23.113-51.2-51.2-51.2zm0 92.16c-22.47 0-40.96-18.49-40.96-40.96s18.49-40.96 40.96-40.96 40.96 18.49 40.96 40.96-18.49 40.96-40.96 40.96z"
        fillRule="nonzero"
      />
      <circle cx={50.88} cy={51.12} r={5.04} />
      <circle cx={71.608} cy={51.12} r={5.04} />
      <path d="M71.453 71.453c-5.526 5.526-14.5 5.526-20.026 0-1.967-1.967-5.16-1.967-7.127 0s-1.967 5.16 0 7.127c9.46 9.46 24.82 9.46 34.28 0 1.967-1.967 1.967-5.16 0-7.127s-5.16-1.967-7.127 0z" />
    </svg>
  );
}

export default SvgSmileOutline;
