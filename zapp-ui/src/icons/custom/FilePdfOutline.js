import * as React from "react";

function SvgFilePdfOutline(props) {
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
        xlinkHref="#file-pdf-outline_svg___Image1"
        x={20}
        y={10}
        width={82.919}
        height={102.9}
        transform="scale(.99902)"
      />
      <defs>
        <image
          id="file-pdf-outline_svg___Image1"
          width={83}
          height={103}
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </svg>
  );
}

export default SvgFilePdfOutline;
