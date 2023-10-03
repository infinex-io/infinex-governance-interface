import React from 'react';
export default function BackIcon({
	width = 12,
	height = 12,
}: {
   width?: number;
   height?: number;
}) {
	return (
      <svg 
         className={`fill-current`}
         width={width}
         height={height}
         viewBox="0 0 12 12" 
         xmlns="http://www.w3.org/2000/svg"
      >
         <path d="M11.3337 5.33317H3.22033L6.94699 1.6065L6.00033 0.666504L0.666992 5.99984L6.00033 11.3332L6.94033 10.3932L3.22033 6.6665H11.3337V5.33317Z" />
      </svg>

	);
}