import React, { useState } from 'react';
import { Button, CloseIcon, Flex, IconButton, TextInput } from '@synthetixio/ui';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import Connector from 'containers/Connector';
import Modal from 'containers/Modal';
import useUpdateUserDetailsMutation from 'mutations/boardroom/useUpdateUserDetailsMutation';
import useUserDetailsQuery, { GetUserDetails } from 'queries/boardroom/useUserDetailsQuery';

type EditProfileModalProps = {
	userProfile: GetUserDetails;
};

const EditProfileModal: React.FC<EditProfileModalProps> = ({ userProfile }) => {
	const { t } = useTranslation();
	const { setIsOpen } = Modal.useContainer();

	const { walletAddress } = Connector.useContainer();

	const updateUserMutation = useUpdateUserDetailsMutation();
	const userDetailsQuery = useUserDetailsQuery(walletAddress ?? '');

	const [username, setUsername] = useState<string>(userProfile.username);
	const [pfpThumbnailUrl, setPfpThumbnailUrl] = useState<string>(userProfile.pfpThumbnailUrl);
	const [about, setAbout] = useState<string>(userProfile.about);
	const [discord, setDiscord] = useState<string>(userProfile.discord);
	const [twitter, setTwitter] = useState<string>(userProfile.twitter);
	const [github, setGithub] = useState<string>(userProfile.github);

	const [pitch, setPitch] = useState<string>(JSON.parse(userProfile.delegationPitches).synthetix);

	const handleProfileEdit = () => {
		if (userDetailsQuery.data) {
			const delegationPitches = {
				synthetix: pitch,
			};
			const jsonFormatted = JSON.stringify(delegationPitches);
			const status = updateUserMutation.mutate(
				{
					...userDetailsQuery.data,
					username,
					about,
					twitter,
					pfpThumbnailUrl,
					discord,
					github,
					delegationPitches: jsonFormatted,
				},
				{
					onSuccess: () => {
						setIsOpen(false);
					},
				}
			);
		}
	};

	return (
		<StyledNominateModalWrapper direction="column" alignItems="center">
			<StyledIconButton onClick={() => setIsOpen(false)} active rounded>
				<CloseIcon active />
			</StyledIconButton>
			<StyledModalHeadline>{t('modals.editProfile.headline')}</StyledModalHeadline>
			<StyledModalSubheadline>{t('modals.editProfile.subheadline')}</StyledModalSubheadline>
			<StyledBlackBox direction="column" alignItems="center">
				<InputRow alignItems="center">
					<InputCol direction="column">
						<StyledBlackBoxSubline>
							{t('modals.editProfile.inputs.headline.username')}
						</StyledBlackBoxSubline>
						<StyledInput
							placeholder={t('modals.editProfile.inputs.placeholder.username')}
							value={username}
							onInput={(e) => setUsername(e.target.value)}
							id="username"
						></StyledInput>
					</InputCol>

					<InputCol direction="column">
						<StyledBlackBoxSubline>
							{t('modals.editProfile.inputs.headline.profileImageUrl')}
						</StyledBlackBoxSubline>
						<StyledInput
							placeholder={t('modals.editProfile.inputs.placeholder.profileImageUrl')}
							value={pfpThumbnailUrl}
							onInput={(e) => setPfpThumbnailUrl(e.target.value)}
							id="profileImageURL"
						></StyledInput>
					</InputCol>
				</InputRow>
				<InputRow>
					<InputCol direction="column">
						<StyledBlackBoxSubline>
							{t('modals.editProfile.inputs.headline.pitch')}
						</StyledBlackBoxSubline>
						<StyledInput
							placeholder={t('modals.editProfile.inputs.placeholder.pitch')}
							value={pitch}
							onInput={(e) => setPitch(e.target.value)}
							id="about"
						></StyledInput>
					</InputCol>
				</InputRow>
				<InputRow>
					<InputCol direction="column">
						<StyledBlackBoxSubline>
							{t('modals.editProfile.inputs.headline.about')}
						</StyledBlackBoxSubline>
						<StyledInput
							placeholder={t('modals.editProfile.inputs.placeholder.about')}
							value={about}
							onInput={(e) => setAbout(e.target.value)}
							id="about"
						></StyledInput>
					</InputCol>

					<InputCol direction="column">
						<StyledBlackBoxSubline>
							{t('modals.editProfile.inputs.headline.github')}
						</StyledBlackBoxSubline>
						<StyledInput
							placeholder={t('modals.editProfile.inputs.placeholder.github')}
							value={github}
							onInput={(e) => setGithub(e.target.value)}
							id="github"
						></StyledInput>
					</InputCol>
				</InputRow>
				<InputRow>
					<InputCol direction="column">
						<StyledBlackBoxSubline>
							{t('modals.editProfile.inputs.headline.discord')}
						</StyledBlackBoxSubline>
						<StyledInput
							placeholder={t('modals.editProfile.inputs.placeholder.discord')}
							value={discord}
							onInput={(e) => setDiscord(e.target.value)}
							id="discord"
						></StyledInput>
					</InputCol>

					<InputCol direction="column">
						<StyledBlackBoxSubline>
							{t('modals.editProfile.inputs.headline.twitter')}
						</StyledBlackBoxSubline>
						<StyledInput
							placeholder={t('modals.editProfile.inputs.placeholder.twitter')}
							value={twitter}
							onInput={(e) => setTwitter(e.target.value)}
							id="twitter"
						></StyledInput>
					</InputCol>
				</InputRow>
			</StyledBlackBox>
			<Button
				variant="primary"
				onClick={() => {
					handleProfileEdit();
				}}
				text="Save Profile"
			/>
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

const StyledModalSubheadline = styled.h2`
	font-family: ${(props) => props.theme.fonts.regular};
	color: ${(props) => props.theme.colors.white};
	font-size: 14px;
`;

const StyledBlackBox = styled(Flex)`
	background-color: ${({ theme }) => theme.colors.black};
	max-width: 314px;
	padding: 24px 50px;
`;

const InputRow = styled(Flex)`
	margin: 10px 0px;
`;

const InputCol = styled(Flex)`
	margin: 0px 8px;
`;

const StyledIconButton = styled(IconButton)`
	position: absolute;
	top: 40px;
	right: 40px;
`;

const StyledBlackBoxSubline = styled.h6`
	font-family: 'Inter Bold';
	font-size: 1rem;
	color: ${({ theme }) => theme.colors.grey};
	margin: 0;
`;

const StyledInput = styled(TextInput)`
	font-family: 'Inter Bold';
	font-size: 2rem;
	color: ${(props) => props.theme.colors.white};
`;
