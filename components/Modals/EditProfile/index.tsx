import { Flex } from '@synthetixio/ui';
import React from 'react';
import styled from 'styled-components';

type EditProfileModalProps = {};

const EditProfileModal: React.FC<EditProfileModalProps> = ({}) => {
	return (
		<StyledNominateModalWrapper direction="column" alignItems="center">
			<StyledModalHeadline>Edit Profile</StyledModalHeadline>
		</StyledNominateModalWrapper>
	);
};
export default EditProfileModal;

const StyledNominateModalWrapper = styled(Flex)`
	background: black;
	height: 100%;
	width: 100%;
	background-repeat: no-repeat;
	background-size: contain;
	position: relative;
	padding-top: 10%;
`;

const StyledModalHeadline = styled.h1`
	font-family: 'Inter Bold';
	font-size: 3.33rem;
	color: ${({ theme }) => theme.colors.white};
`;
