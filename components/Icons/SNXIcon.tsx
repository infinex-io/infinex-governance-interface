import React, { SVGProps } from 'react';
export default function InfinexIcon({
	className,
	onClick,
	width = 59,
	height = 53,
}: SVGProps<SVGSVGElement>) {
	return (
		<svg
			className={className}
			width={width}
			height={height}
			viewBox="0 0 59 53"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
			onClick={onClick}
		>
			<path d="M41.5 16.2917V52.75H0V0.75H11.463V9.18802H7.96296V44.669H33.537V16.2917H41.5Z"/>
			<path d="M58.4074 0.75V52.75H46.9444V44.669H50.4444V8.83095H24.8519V37.2083H16.8889V0.75H58.4074Z" />
		</svg>
	);
}
