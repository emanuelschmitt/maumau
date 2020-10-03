import * as React from 'react';

function HeartsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" width="1em" height="1em" {...props}>
      <path
        fill="currentColor"
        d="M88.174 19.797c-9.655-10.028-26.004-9.791-35.848.053l-1.358 1.358a.5.5 0 01-.707 0l-1.358-1.358c-9.844-9.844-26.193-10.081-35.848-.052-9.359 9.721-9.247 25.19.336 34.773l36.516 36.516a.999.999 0 001.414 0l36.516-36.516c9.585-9.584 9.697-25.052.337-34.774z"
      />
    </svg>
  );
}

export default HeartsIcon;
