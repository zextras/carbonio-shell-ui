import * as React from "react";

function SvgAddressBook(props) {
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
      <path d="M0 0v122.88h122.88V0H0z" fill="none" />
      <path
        d="M97.28 107.52H35.84c-8.426 0-15.36-6.934-15.36-15.36v-5.12h-5.12c-2.809 0-5.12-2.311-5.12-5.12s2.311-5.12 5.12-5.12h5.12V46.08h-5.12c-2.809 0-5.12-2.311-5.12-5.12s2.311-5.12 5.12-5.12h5.12v-5.12c0-8.426 6.934-15.36 15.36-15.36h61.44c8.426 0 15.36 6.934 15.36 15.36v61.44c0 8.426-6.934 15.36-15.36 15.36zM58.17 82.359c.033-5.351 4.445-9.744 9.803-9.744 5.358 0 9.771 4.393 9.803 9.744a5.054 5.054 0 005.081 5.02 5.053 5.053 0 005.019-5.081c-.066-10.865-9.025-19.783-19.903-19.783-10.878 0-19.836 8.918-19.903 19.783a5.053 5.053 0 005.02 5.081 5.053 5.053 0 005.08-5.02zm9.803-26.572c5.559 0 10.134-4.575 10.134-10.134S73.532 35.52 67.973 35.52 57.84 40.094 57.84 45.653c0 5.559 4.574 10.134 10.133 10.134z"
        fillRule="nonzero"
      />
    </svg>
  );
}

export default SvgAddressBook;
