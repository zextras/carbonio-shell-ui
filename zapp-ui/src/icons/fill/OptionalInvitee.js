import * as React from "react";

function SvgOptionalInvitee(props) {
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
      <path fill="none" d="M0 0h122.88v122.88H0z" />
      <path
        d="M51.2 56.32c11.235 0 20.48-9.245 20.48-20.48S62.435 15.36 51.2 15.36s-20.48 9.245-20.48 20.48 9.245 20.48 20.48 20.48zM81.92 107.52c2.809 0 5.12-2.311 5.12-5.12 0-19.661-16.179-35.84-35.84-35.84S15.36 82.739 15.36 102.4c0 2.809 2.311 5.12 5.12 5.12"
        fillRule="nonzero"
      />
      <circle cx={97.28} cy={25.6} r={5.12} />
      <path
        d="M97.28 35.84c-2.809 0-5.12 2.311-5.12 5.12v25.6c0 2.809 2.311 5.12 5.12 5.12s5.12-2.311 5.12-5.12v-25.6c0-2.809-2.311-5.12-5.12-5.12z"
        fillRule="nonzero"
      />
    </svg>
  );
}

export default SvgOptionalInvitee;
