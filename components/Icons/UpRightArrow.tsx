import React, { SVGProps } from 'react';
export default function UpRightArrow({
    fill,
    width = 10,
    height = 10,
}: SVGProps<SVGSVGElement>) {
    return (
        <svg width={width} height={height} viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.2 7L0.5 6.3L5.3 1.5H1V0.5H7V6.5H6V2.2L1.2 7Z" fill={fill} />
        </svg>
    );
}
