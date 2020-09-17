import * as React from "react";

function SvgFilePresentationOutline(props) {
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
        xlinkHref="#file-presentation-outline_svg___Image1"
        x={20}
        y={10}
        width={82.919}
        height={102.9}
        transform="scale(.99902)"
      />
      <defs>
        <image
          id="file-presentation-outline_svg___Image1"
          width={83}
          height={103}
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </svg>
  );
}

export default SvgFilePresentationOutline;
