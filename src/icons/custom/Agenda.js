import * as React from "react";

function SvgAgenda(props) {
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
      <clipPath id="agenda_svg__a">
        <path d="M0 0h122.88v122.88H0z" />
      </clipPath>
      <g clipPath="url(#agenda_svg__a)">
        <path d="M0 0v122.88h122.88V0H0z" fill="none" />
        <path
          d="M97.28 107.52H35.84c-8.426 0-15.36-6.934-15.36-15.36v-5.12h-5.12c-2.809 0-5.12-2.311-5.12-5.12s2.311-5.12 5.12-5.12h5.12V46.08h-5.12c-2.809 0-5.12-2.311-5.12-5.12s2.311-5.12 5.12-5.12h5.12v-5.12c0-8.426 6.934-15.36 15.36-15.36h61.44c8.426 0 15.36 6.934 15.36 15.36v61.44c0 8.426-6.934 15.36-15.36 15.36zM81.504 42.957l-19.354 25.6-8.345-10.803a5.13 5.13 0 00-4.045-1.978c-2.812 0-5.126 2.314-5.126 5.126a5.13 5.13 0 001.081 3.149l12.442 15.923a5.123 5.123 0 004.045 1.946 5.123 5.123 0 004.044-1.997l23.399-30.72A5.152 5.152 0 0090.7 46.08c0-2.826-2.326-5.151-5.151-5.151a5.153 5.153 0 00-4.096 2.028h.051z"
          fillRule="nonzero"
        />
      </g>
    </svg>
  );
}

export default SvgAgenda;
