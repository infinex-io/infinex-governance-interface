import React from 'react';
import Image from 'next/image';
import Blockies from 'react-blockies';
import { parseURL } from 'utils/ipfs';
import clsx from 'clsx';

type AvatarProps = {
	url?: string;
	walletAddress: string;
	width?: number;
	height?: number;
	className?: string;
};

const Avatar: React.FC<AvatarProps> = ({
	walletAddress,
	url,
	width = 120,
	height = 120,
	className,
}) => {
	const parsedUrl = url && parseURL(url);

	return parsedUrl ? (
		<Image
			className={clsx(className, 'rounded-full')}
			src={parsedUrl}
			alt={`${walletAddress} avatar url`}
			height={width}
			width={height}
		/>
	) : (
		<Blockies className={className} seed={walletAddress} />
	);
};
export default Avatar;
