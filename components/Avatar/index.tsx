import React, { useState } from 'react';
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
	const [showBlockies, setShowBlockies] = useState(false);
	const parsedUrl = url && parseURL(url);

	return parsedUrl && !showBlockies ? (
		<img
			onError={() => setShowBlockies(true)}
			className={clsx(className, 'rounded-full')}
			src={parsedUrl}
			alt={`${walletAddress} avatar url`}
			height={width}
			width={height}
		/>
	) : (
		<Blockies seed={walletAddress} scale={scale || 7} className={clsx(className, 'rounded-full')} />
	);
};
export default Avatar;
