import React from 'react';
import Image from 'next/image';
import Blockies from 'react-blockies';
import { parseURL } from 'utils/ipfs';

type AvatarProps = {
	url?: string;
	walletAddress: string;
	width?: number;
	height?: number;
};

const Avatar: React.FC<AvatarProps> = ({ walletAddress, url, width = 120, height = 120 }) => {
	const parsedUrl = url && parseURL(url);

	return parsedUrl ? (
		<Image
			className="rounded-full"
			src={parsedUrl}
			alt={`${walletAddress} avatar url`}
			height={width}
			width={height}
		/>
	) : (
		<Blockies seed={walletAddress} scale={6} className="rounded-full" />
	);
};
export default Avatar;
