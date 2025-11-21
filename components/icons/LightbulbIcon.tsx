import React from 'react';

const LightbulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.311a7.5 7.5 0 0 1-7.5 0c.407-.92.834-1.826 1.302-2.712a5.98 5.98 0 0 1 4.896 0c.468.886.895 1.792 1.302 2.712ZM12 3v1.518c.28.02.56.059.84.108a6.01 6.01 0 0 1 2.258 1.258 6.003 6.003 0 0 1 1.258 2.258c.049.28.088.56.108.84V9a6.01 6.01 0 0 1-1.258 3.742 6.003 6.003 0 0 1-2.258 1.258A6.01 6.01 0 0 1 9 12.75V9c0-.28.039-.56.108-.84a6.003 6.003 0 0 1 1.258-2.258 6.01 6.01 0 0 1 2.258-1.258A6.01 6.01 0 0 1 12 3Z"
    />
  </svg>
);

export default LightbulbIcon;