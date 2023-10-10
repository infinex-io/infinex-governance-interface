import React, { SVGProps } from 'react';
export default function MirrorIcon({
    fill,
    width = 17.25,
    height = 19,
}: SVGProps<SVGSVGElement>) {
    return (
        <svg width={width} height={height} viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M11.5202 5.34146C11.5203 5.33021 11.5203 5.31895 11.5203 5.30768C11.5203 5.29641 11.5203 5.28515 11.5202 5.2739V4.88708H11.5013C11.2697 2.34242 8.95588 0.343742 6.13571 0.343742C3.31554 0.343742 1.00175 2.34242 0.770156 4.88708H0.750977V15.6563H11.5202V5.34146Z" fill={fill} />
        </svg>
    );
}
