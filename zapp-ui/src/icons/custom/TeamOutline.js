import * as React from "react";

function SvgTeamOutline(props) {
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
        d="M61.44 10.32c-28.244 0-51.12 22.876-51.12 51.12s22.876 51.12 51.12 51.12c2.816.01 5.627-.224 8.402-.702l32.074-6.391c2.275-.586 3.035-.826 3.584-3.822l6.356-31.77c.478-2.786.714-5.609.704-8.435 0-28.244-22.876-51.12-51.12-51.12zm0 10.08c22.651 0 41.04 18.389 41.04 41.04s-18.389 41.04-41.04 41.04S20.4 84.091 20.4 61.44 38.789 20.4 61.44 20.4z"
        fillRule="nonzero"
      />
      <path d="M88.8 61.44c0 3.576-2.904 6.48-6.48 6.48s-6.48-2.904-6.48-6.48 2.904-6.48 6.48-6.48 6.48 2.904 6.48 6.48zM47.04 61.44c0 4.371-3.549 7.92-7.92 7.92s-7.92-3.549-7.92-7.92 3.549-7.92 7.92-7.92 7.92 3.549 7.92 7.92zM70.8 61.44c0 5.166-4.194 9.36-9.36 9.36s-9.36-4.194-9.36-9.36 4.194-9.36 9.36-9.36 9.36 4.194 9.36 9.36z" />
    </svg>
  );
}

export default SvgTeamOutline;
