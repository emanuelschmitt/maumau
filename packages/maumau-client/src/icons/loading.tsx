import React from 'react';

function LoadingIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" width="1em" height="1em" {...props}>
      <path d="M50.287 32A18.287 18.287 0 1132 13.713a1.5 1.5 0 110 3A15.287 15.287 0 1047.287 32a1.5 1.5 0 013 0z" />
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 0 0"
        to="360 0 0"
        begin="0s"
        dur="3s"
        repeatCount="indefinite"
      />
    </svg>
  );
}

export default LoadingIcon;
