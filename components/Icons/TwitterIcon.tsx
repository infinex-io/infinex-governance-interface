import React from 'react';
import { SVGSocialIconProps } from './types';

export default function TwitterIcon({
	fill,
	onClick,
	width = '18',
	height = '18',
	className,
}: SVGSocialIconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M10.564 7.73209L16.6858 0.720428H15.2352L9.91959 6.80856L5.67406 0.720428H0.777344L7.19742 9.92676L0.777344 17.2796H2.2281L7.84148 10.8503L12.3251 17.2796H17.2218L10.5637 7.73209H10.564ZM8.57701 10.0079L7.92652 9.09113L2.75083 1.79651H4.9791L9.15595 7.6835L9.80644 8.60024L15.2358 16.2524H13.0076L8.57701 10.0082V10.0079Z" fill={fill} />
		</svg>
	);
}
