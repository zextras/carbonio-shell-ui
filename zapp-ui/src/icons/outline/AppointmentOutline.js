import * as React from "react";

function SvgAppointmentOutline(props) {
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
      <path
        d="M76.8 20.48v-5.12c0-2.809 2.311-5.12 5.12-5.12s5.12 2.311 5.12 5.12v5.12h5.12c8.426 0 15.36 6.934 15.36 15.36v61.44c0 8.426-6.934 15.36-15.36 15.36H30.72c-8.426 0-15.36-6.934-15.36-15.36V35.84c0-8.426 6.934-15.36 15.36-15.36h5.12v-5.12a5.143 5.143 0 01.335-1.811 5.204 5.204 0 013.512-3.147 5.057 5.057 0 013.2.219c.611.251 1.17.621 1.642 1.082a5.145 5.145 0 011.551 3.657v5.12H76.8zm15.36 81.92c2.809 0 5.12-2.311 5.12-5.12V35.84c0-2.809-2.311-5.12-5.12-5.12h-5.12v5.12c0 2.809-2.311 5.12-5.12 5.12s-5.12-2.311-5.12-5.12v-5.12H46.08v5.12c0 2.809-2.311 5.12-5.12 5.12s-5.12-2.311-5.12-5.12v-5.12h-5.12c-2.809 0-5.12 2.311-5.12 5.12v61.44c.004.577.098 1.149.291 1.694a5.21 5.21 0 003.194 3.155c.527.18 1.079.267 1.635.271h61.44z"
        fillRule="nonzero"
      />
      <path
        d="M75.264 53.197l-19.354 25.6-8.345-10.803a5.13 5.13 0 00-4.045-1.978c-2.812 0-5.126 2.314-5.126 5.126a5.13 5.13 0 001.081 3.149l12.442 15.923a5.123 5.123 0 004.045 1.946 5.123 5.123 0 004.044-1.997l23.399-30.72a5.152 5.152 0 001.055-3.123c0-2.826-2.326-5.151-5.151-5.151a5.153 5.153 0 00-4.096 2.028h.051z"
        fillRule="nonzero"
      />
    </svg>
  );
}

export default SvgAppointmentOutline;
