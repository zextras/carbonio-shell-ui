import * as React from "react";

function SvgShortcutsOutline(props) {
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
        xlinkHref="#shortcuts-outline_svg___Image1"
        x={10}
        y={10}
        width={102.9}
        height={102.9}
        transform="scale(.99902)"
      />
      <defs>
        <image
          id="shortcuts-outline_svg___Image1"
          width={103}
          height={103}
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </svg>
  );
}

export default SvgShortcutsOutline;
