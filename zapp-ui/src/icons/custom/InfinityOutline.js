import * as React from "react";

function SvgInfinityOutline(props) {
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
        d="M47.069 54.269l-4.301-4.277c-6.318-6.318-16.578-6.318-22.896 0s-6.318 16.578 0 22.896 16.578 6.318 22.896 0L72.95 42.85c10.26-10.26 26.919-10.26 37.179 0s10.26 26.92 0 37.18-26.919 10.26-37.179 0l-4.339-4.219 7.2-7.2 4.279 4.279.001-.002c6.319 6.318 16.578 6.318 22.897 0 6.318-6.318 6.318-16.578 0-22.896-6.319-6.318-16.578-6.318-22.897 0L49.91 80.03c-10.26 10.26-26.92 10.26-37.18 0s-10.26-26.92 0-37.18 26.92-10.26 37.18 0l4.359 4.219-7.2 7.2z"
        stroke="#fff"
        strokeWidth={0.24}
      />
    </svg>
  );
}

export default SvgInfinityOutline;
