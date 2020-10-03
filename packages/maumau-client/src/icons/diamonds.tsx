import * as React from 'react';

function SvgComponent(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" width="1em" height="1em" {...props}>
      <path
        fill="currentColor"
        d="M80.591 49.651L50.41 6.35a.5.5 0 00-.82 0l-30.181 43.3a.5.5 0 00-.002.569l30.181 43.919a.5.5 0 00.824 0L80.593 50.22a.5.5 0 00-.002-.569z"
      />
    </svg>
  );
}

export default SvgComponent;
