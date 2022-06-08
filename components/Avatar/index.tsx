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
	scale?: number;
	className?: string;
};

const Avatar: React.FC<AvatarProps> = ({
	walletAddress,
	url,
	width = 120,
	height = 120,
	scale,
	className,
}) => {
	const parsedUrl = url && parseURL(url);
	const isValidUrl = (parsedUrl?: string) => {
		const matchPattern = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/;
		if (parsedUrl) return;
		else return matchPattern.test(parsedUrl!);
	};

	if (parsedUrl && !parsedUrl.includes('http'))
		return (
			<Blockies
				seed={walletAddress}
				scale={scale || 8}
				className={clsx(className, 'rounded-full')}
			/>
		);

	return (
		<Image
			className={clsx(className, 'rounded-full')}
			src={parsedUrl!}
			alt={`${walletAddress} avatar url`}
			height={width}
			width={height}
		/>
	);
};
export default Avatar;
