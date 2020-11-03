import * as React from "react";

function SvgEmptyFolder(props) {
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
        d="M99.84 36.096c6.919-.085 12.688 5.523 12.8 12.442v43.98c-.112 6.919-5.881 12.527-12.8 12.442h-76.8c-6.919.085-12.688-5.523-12.8-12.442V30.362c.112-6.919 5.881-12.527 12.8-12.442h23.552c1.53.01 2.978.706 3.942 1.894L64 36.096h35.84zM65.06 60.819l-3.62 3.62-3.62-3.62c-1.986-1.986-5.255-1.986-7.241 0s-1.986 5.255 0 7.241l3.62 3.62-3.62 3.62c-1.986 1.986-1.986 5.255 0 7.241s5.255 1.986 7.241 0l3.62-3.62 3.62 3.62c1.986 1.986 5.255 1.986 7.241 0s1.986-5.255 0-7.241l-3.62-3.62 3.62-3.62c1.986-1.986 1.986-5.255 0-7.241s-5.255-1.986-7.241 0z"
        fillRule="nonzero"
      />
    </svg>
  );
}

export default SvgEmptyFolder;
