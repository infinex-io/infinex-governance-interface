import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import Blockies from 'react-blockies';
import { parseURL } from 'utils/ipfs';

type AvatarProps = {
	url?: string;
	walletAddress: string;
};

const Avatar: React.FC<AvatarProps> = ({ walletAddress, url }) => {
	const parsedUrl = parseURL(url);

	return (
		<ImageContainer>
			{parsedUrl ? (
				<RoundedImage
					src={parsedUrl}
					alt={`${walletAddress} avatar url`}
					height={120}
					width={120}
				/>
			) : (
				<Blockies seed={walletAddress} />
			)}
		</ImageContainer>
	);
};
export default Avatar;

const ImageContainer = styled.div``;

const RoundedImage = styled(Image)`
	border-radius: 60px;
`;
