import * as React from "react";

function SvgTag(props) {
  return (
    <svg viewBox="0 0 627.4 627.4" {...props}>
      <path fill="none" d="M0 0h627.4v627.4H0z" />
      <path
        d="M530.1 346.4L281.4 97.7c-8.5-8.5-19.7-13-30.9-13.2-1.8-.3-3.7-.5-5.5-.5H116.8C98.7 84 84 98.7 84 116.8V245c0 1.9.2 3.7.5 5.5.3 11.2 4.7 22.3 13.2 30.9l248.7 248.7c17.7 17.7 46.4 17.7 64.1 0l119.6-119.6c17.7-17.7 17.7-46.4 0-64.1zM196.5 222.2c-14.2 0-25.7-11.5-25.7-25.7s11.5-25.7 25.7-25.7 25.7 11.5 25.7 25.7-11.5 25.7-25.7 25.7z"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default SvgTag;
