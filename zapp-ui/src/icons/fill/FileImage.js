import * as React from "react";

function SvgFileImage(props) {
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
      <g fillOpacity={0} fill="none">
        <path d="M0 0h122.88v122.88H0z" />
        <path d="M0 0h122.88v122.88H0z" />
      </g>
      <path fill="none" d="M0 0h122.88v122.88H0z" />
      <path fill="none" d="M0 0h122.88v122.88H0z" />
      <path d="M101.07 37.53a5.118 5.118 0 011.331 3.43v58.88c-.083 7.048-5.904 12.801-12.953 12.801H33.434c-7.049 0-12.87-5.753-12.953-12.801v-76.8c.083-7.048 5.904-12.801 12.953-12.801l41.114.001a5.123 5.123 0 013.789 1.69l22.733 25.6zM81.426 93.22a3.37 3.37 0 01-3.076 3.599H41.435l23.287-20.98a2.132 2.132 0 012.861 0l13.843 13.782v3.599zM50.653 56.8c4.213 0 7.68 3.467 7.68 7.68s-3.467 7.68-7.68 7.68-7.68-3.467-7.68-7.68 3.467-7.68 7.68-7.68zm21.028-36.32L90.83 40.96H75.47a4.061 4.061 0 01-3.789-4.352V20.48z" />
    </svg>
  );
}

export default SvgFileImage;
