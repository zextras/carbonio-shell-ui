import * as React from "react";

function SvgDayView(props) {
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
        d="M74.627 112.64H30.72c-8.426 0-15.36-6.934-15.36-15.36V35.84c0-8.426 6.934-15.36 15.36-15.36h5.12v-5.12a5.143 5.143 0 01.335-1.811 5.204 5.204 0 013.512-3.147 5.057 5.057 0 013.2.219c.611.251 1.17.621 1.642 1.082a5.145 5.145 0 011.551 3.657v5.12H76.8v-5.12c0-2.809 2.311-5.12 5.12-5.12s5.12 2.311 5.12 5.12v5.12h5.12c8.426 0 15.36 6.934 15.36 15.36l.08 40.96a5.118 5.118 0 01-1.331 3.43l-27.853 30.72a5.123 5.123 0 01-3.789 1.69zm2.253-15.36l14.029-15.36h-10.24a4.061 4.061 0 00-3.789 4.352V97.28z"
        fillRule="nonzero"
      />
    </svg>
  );
}

export default SvgDayView;
