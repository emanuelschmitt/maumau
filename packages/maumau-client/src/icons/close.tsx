import React from 'react';

function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      height="1em"
      width="1em"
      fill="currentColor"
      viewBox="0 0 519 519"
      fillRule="evenodd"
      clipRule="evenodd"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      imageRendering="optimizeQuality"
      {...props}
    >
      <path d="M16 425l165-166L16 94C-5 73-5 38 16 16 38-5 73-5 94 16l165 165L425 16c21-21 56-21 78 0 21 22 21 57 0 78L337 259l166 166c21 21 21 56 0 78-22 21-57 21-78 0L259 337 94 503c-21 21-56 21-78 0-21-22-21-57 0-78z" />
    </svg>
  );
}

export default CloseIcon;
