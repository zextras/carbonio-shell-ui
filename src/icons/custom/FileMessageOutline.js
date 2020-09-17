import * as React from "react";

function SvgFileMessageOutline(props) {
  return (
    <svg
      viewBox="0 0 123 123"
      fillRule="evenodd"
      clipRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit={2}
      {...props}
    >
      <use
        xlinkHref="#file-message-outline_svg___Image1"
        x={20}
        y={10}
        width={82.919}
        height={102.9}
        transform="scale(.99902)"
      />
      <defs>
        <image
          id="file-message-outline_svg___Image1"
          width={83}
          height={103}
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </svg>
  );
}

export default SvgFileMessageOutline;
