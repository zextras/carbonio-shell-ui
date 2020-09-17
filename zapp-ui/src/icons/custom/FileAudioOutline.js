import * as React from "react";

function SvgFileAudioOutline(props) {
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
        xlinkHref="#file-audio-outline_svg___Image1"
        x={20}
        y={10}
        width={82.919}
        height={102.9}
        transform="matrix(.99902 0 0 .99902 0 0)"
      />
      <defs>
        <image
          id="file-audio-outline_svg___Image1"
          width={83}
          height={103}
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </svg>
  );
}

export default SvgFileAudioOutline;
