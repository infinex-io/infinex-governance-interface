import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import Blockies from 'react-blockies';

type AvatarProps = {
	url?: string;
	walletAddress: string;
};

const Avatar: React.FC<AvatarProps> = ({ walletAddress, url }) => {
	return (
		<ImageContainer>
			{url ? (
				<Image src={url} alt={`${walletAddress} avatar url`} />
			) : (
				<Blockies seed={walletAddress} />
			)}
		</ImageContainer>
	);
};
export default Avatar;

const ImageContainer = styled.div`
	width: 40px;
	height: 40px;
	border-radius: 20px;
`;
