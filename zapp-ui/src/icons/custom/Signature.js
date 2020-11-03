import * as React from "react";

function SvgSignature(props) {
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
      <path d="M61.369 72.316l-13.224 8.873a20.353 20.353 0 00-2.104-.53c-10.836-2.134-21.374 4.703-23.919 15.347l-.016-.003-1.577 8.006a5.043 5.043 0 01-5.919 3.972 5.043 5.043 0 01-3.971-5.919l8.671-44.035c.019-.094.04-.187.064-.279.053-.299.109-.598.168-.898 5.451-27.682 32.352-45.731 60.034-40.28 13.841 2.726 25.274 10.814 32.565 21.681L86.488 55.462l-.047-.072-7.186-10.71a7.335 7.335 0 00-.063-.092l-4.807-7.164c-1.55-2.31-4.683-2.927-6.993-1.377s-2.927 4.683-1.377 6.993l7.186 10.711c.02.031.042.061.063.091l4.807 7.165.048.071-8.55 5.736a5.052 5.052 0 00-.481-.901l-4.452-6.011a5.38 5.38 0 00-.178-.285L54.392 46.026c-1.55-2.309-4.684-2.927-6.994-1.377s-2.927 4.684-1.377 6.994l4.452 6.01c.056.096.115.191.178.286l10.066 13.59c.194.289.413.552.652.787zM112.56 102.96a5.042 5.042 0 00-5.04-5.04h-72c-2.782 0-5.04 2.258-5.04 5.04s2.258 5.04 5.04 5.04h72a5.042 5.042 0 005.04-5.04z" />
      <path d="M107.52 97.92c2.782 0 5.04 2.258 5.04 5.04s-2.258 5.04-5.04 5.04h-72c-2.782 0-5.04-2.258-5.04-5.04s2.258-5.04 5.04-5.04h72z" />
    </svg>
  );
}

export default SvgSignature;
