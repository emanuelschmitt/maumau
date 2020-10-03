import * as React from 'react';

function CardsStatusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="7.5 7.5 50 50" width="1em" height="1em" {...props}>
      <path
        fill="currentColor"
        d="M36.167 54.63a3.164 3.164 0 002.415.311 3.161 3.161 0 001.927-1.489l14.349-25.019c.423-.737.534-1.595.312-2.416s-.751-1.505-1.489-1.929l-14.105-8.089a3.156 3.156 0 00-2.416-.311 3.162 3.162 0 00-1.928 1.488l-1.885 3.285v21.511a4.187 4.187 0 01-4.181 4.183h-7.615c.16.141.323.279.509.386l14.107 8.089z"
      />
      <path
        fill="currentColor"
        d="M9.719 41.973a3.186 3.186 0 003.182 3.183h16.264a3.186 3.186 0 003.181-3.183V13.13a3.185 3.185 0 00-3.181-3.182H12.901a3.186 3.186 0 00-3.182 3.182v28.843z"
      />
    </svg>
  );
}

export default CardsStatusIcon;
