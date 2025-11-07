
import React from 'react';

const SpinnerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className={`animate-spin ${props.className || ''}`}
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3v3m0 12v3m9-9h-3m-12 0H3m16.5-6.5L18.25 9.25M5.75 14.75L7.5 16.5m10.25-7.25L16.5 7.5M9.25 18.25L7.5 16.5"
    />
  </svg>
);

export default SpinnerIcon;
