import * as React from "react";

function SvgRedirectOutline(props) {
  return (
    <svg
      viewBox="0 0 123 123"
      fillRule="evenodd"
      clipRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit={2}
      {...props}
    >
      <path fill="none" d="M0 0h122.88v122.88H0z" />
      <clipPath id="redirect-outline_svg__a">
        <path d="M0 0h122.88v122.88H0z" />
      </clipPath>
      <g clipPath="url(#redirect-outline_svg__a)">
        <path d="M0 0h122.88v122.88" fill="none" />
        <path
          d="M28.672 107.52h65.536c7.546-.276 13.541-6.686 13.312-14.234V87.04c0-2.809-2.311-5.12-5.12-5.12s-5.12 2.311-5.12 5.12v6.246a3.702 3.702 0 01-3.072 3.994H28.672a3.702 3.702 0 01-3.072-3.994V29.594a3.702 3.702 0 013.072-3.994h7.168c2.809 0 5.12-2.311 5.12-5.12s-2.311-5.12-5.12-5.12h-7.168c-7.546.276-13.541 6.686-13.312 14.234v63.692c-.229 7.548 5.766 13.958 13.312 14.234z"
          fillRule="nonzero"
        />
        <g>
          <path
            d="M106.427 42.566l-20.48-25.6a5.119 5.119 0 00-3.723-1.606c-2.809 0-5.12 2.311-5.12 5.12a5.12 5.12 0 00.856 2.834L91.784 40.62h-30.55c-8.427 0-15.36 6.934-15.36 15.36v26.56c0 2.809 2.311 5.12 5.12 5.12 2.808 0 5.12-2.311 5.12-5.12V55.98c0-2.809 2.311-5.12 5.12-5.12h30.55L77.96 68.166c-1.731 2.194-1.362 5.421.819 7.168a5.128 5.128 0 003.175 1.126 5.12 5.12 0 003.993-1.946l20.48-25.6a5.131 5.131 0 000-6.348z"
            fillRule="nonzero"
          />
        </g>
      </g>
    </svg>
  );
}

export default SvgRedirectOutline;
