import React from 'react';

export default function DisconnectIcon({
   width = 20,
   height = 18,
   fill = "#8B8FA3"
}: {
   width?: number;
   height?: number;
   fill?: string;
}) {
   return (
      <svg width={width} height={height} viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M15 4L13.59 5.41L16.17 8H6V10H16.17L13.59 12.58L15 14L20 9L15 4ZM2 2H10V0H2C0.9 0 0 0.9 0 2V16C0 17.1 0.9 18 2 18H10V16H2V2Z" fill={fill} />
      </svg>
   );
}




