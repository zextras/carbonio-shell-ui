import * as React from "react";

function SvgSeries(props) {
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
      <path fill="none" d="M0 0h122.88v122.88H0z" />
      <path
        d="M56.32 20.48v-5.12c0-2.809 2.311-5.12 5.12-5.12s5.12 2.311 5.12 5.12v5.12h5.12c8.426 0 15.36 6.934 15.36 15.36v41.28c0 8.426-6.934 15.36-15.36 15.36H30.4c-8.426 0-15.36-6.934-15.36-15.36V35.84c0-8.426 6.934-15.36 15.36-15.36h5.12v-5.12a5.143 5.143 0 01.335-1.811 5.204 5.204 0 013.512-3.147 5.057 5.057 0 013.2.219c.611.251 1.17.621 1.642 1.082a5.145 5.145 0 011.551 3.657v5.12h10.56z"
        fillRule="nonzero"
      />
      <path
        d="M97.221 40.96c5.982 2.105 10.32 7.836 10.32 14.5l-.021 41.82c0 8.426-6.934 15.36-15.36 15.36H50.312c-6.635 0-12.344-4.299-14.472-10.24h56.32c2.809 0 5.12-2.311 5.12-5.12l-.059-56.32z"
        fillRule="nonzero"
      />
    </svg>
  );
}

export default SvgSeries;
