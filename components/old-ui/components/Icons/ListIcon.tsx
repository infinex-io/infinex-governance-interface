import React from 'react';
import { SVGIconProps } from './types';

export default function ListIcon({ onClick }: SVGIconProps) {
	return (
		<svg
			onClick={onClick}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M4 8C4 7.44772 4.44772 7 5 7C5.55228 7 6 7.44772 6 8C6 8.55228 5.55228 9 5 9C4.44772 9 4 8.55228 4 8ZM4 12C4 11.4477 4.44772 11 5 11C5.55228 11 6 11.4477 6 12C6 12.5523 5.55228 13 5 13C4.44772 13 4 12.5523 4 12ZM5 15C4.44772 15 4 15.4477 4 16C4 16.5523 4.44772 17 5 17C5.55228 17 6 16.5523 6 16C6 15.4477 5.55228 15 5 15Z"
				fill="#00D1FF"
			/>
			<rect x="7" y="7" width="12" height="2" rx="1" fill="#00D1FF" />
			<rect x="7" y="11" width="12" height="2" rx="1" fill="#00D1FF" />
			<rect x="7" y="15" width="12" height="2" rx="1" fill="#00D1FF" />
		</svg>
	);
}
