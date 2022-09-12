import React, { useState } from 'react';
import Blockies from 'react-blockies';
import clsx from 'clsx';
import { parseURL } from 'utils/ipfs';

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
	const [showBlockies, setShowBlockies] = useState(false);
	let parsedUrl: URL | undefined | '';
	try {
		parsedUrl = url && new URL(parseURL(url));
	} catch (error) {
		console.error(error);
	}

	return parsedUrl instanceof URL &&
		(parsedUrl.host === 'ipfs.io' || parsedUrl.host === 'ipfs.pics') &&
		!showBlockies ? (
		// eslint-disable-next-line @next/next/no-img-element
		<img
			onError={() => setShowBlockies(true)}
			className={clsx(className, 'rounded-full')}
			src={parsedUrl.href}
			alt={`${walletAddress} avatar url`}
			height={width}
			width={height}
			data-testid="avatar-image"
		/>
	) : (
		<Blockies seed={walletAddress} scale={scale || 7} className={clsx(className, 'rounded-full')} />
	);
};
export default Avatar;
