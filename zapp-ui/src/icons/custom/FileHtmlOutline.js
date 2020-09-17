import * as React from "react";

function SvgFileHtmlOutline(props) {
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
        xlinkHref="#file-html-outline_svg___Image1"
        x={20}
        y={10}
        width={82.919}
        height={102.9}
        transform="scale(.99902)"
      />
      <defs>
        <image
          id="file-html-outline_svg___Image1"
          width={83}
          height={103}
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </svg>
  );
}

export default SvgFileHtmlOutline;
