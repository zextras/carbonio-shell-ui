import * as React from "react";

function SvgFileImageOutline(props) {
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
        xlinkHref="#file-image-outline_svg___Image1"
        x={20}
        y={10}
        width={82.919}
        height={102.9}
        transform="scale(.99902)"
      />
      <defs>
        <image
          id="file-image-outline_svg___Image1"
          width={83}
          height={103}
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </svg>
  );
}

export default SvgFileImageOutline;
