import { Button, Flex, IconButton, TextInput } from 'components/old-ui';
import { useModalContext } from 'containers/Modal';
import useUpdateUserDetailsMutation from 'mutations/boardroom/useUpdateUserDetailsMutation';
import useUserDetailsQuery, { GetUserDetails } from 'queries/boardroom/useUserDetailsQuery';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useAccount } from 'wagmi';

import SecondaryModal from '../SecondaryModal';

type EditProfileModalProps = {
	userProfile: GetUserDetails;
};

const EditProfileModal: React.FC<EditProfileModalProps> = ({ userProfile }) => {
	const { t } = useTranslation();
	const { setIsOpen } = useModalContext();

	const { data } = useAccount();

	const updateUserMutation = useUpdateUserDetailsMutation();
	const userDetailsQuery = useUserDetailsQuery(data?.address ?? '');

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
		<SecondaryModal maxWidth="50%">
			<StyledModalHeadline>{t('modals.editProfile.headline')}</StyledModalHeadline>
			<StyledModalSubheadline>{t('modals.editProfile.subheadline')}</StyledModalSubheadline>
			<InputRow alignItems="center">
				<InputCol direction="column">
					<StyledBlackBoxSubline>
						{t('modals.editProfile.inputs.headline.username')}
					</StyledBlackBoxSubline>
					<StyledInput
						placeholder={t('modals.editProfile.inputs.placeholder.username')}
						value={username}
						onInput={setUsername}
						id="username"
					/>
				</InputCol>

				<InputCol direction="column">
					<StyledBlackBoxSubline>
						{t('modals.editProfile.inputs.headline.profileImageUrl')}
					</StyledBlackBoxSubline>
					<StyledInput
						placeholder={t('modals.editProfile.inputs.placeholder.profileImageUrl')}
						value={pfpThumbnailUrl}
						onInput={setPfpThumbnailUrl}
						id="profileImageURL"
					/>
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
						onInput={setPitch}
						id="about"
					/>
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
						onInput={setAbout}
						id="about"
					/>
				</InputCol>

				<InputCol direction="column">
					<StyledBlackBoxSubline>
						{t('modals.editProfile.inputs.headline.github')}
					</StyledBlackBoxSubline>
					<StyledInput
						placeholder={t('modals.editProfile.inputs.placeholder.github')}
						value={github}
						onInput={setGithub}
						id="github"
					/>
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
						onInput={setDiscord}
						id="discord"
					/>
				</InputCol>

				<InputCol direction="column">
					<StyledBlackBoxSubline>
						{t('modals.editProfile.inputs.headline.twitter')}
					</StyledBlackBoxSubline>
					<StyledInput
						placeholder={t('modals.editProfile.inputs.placeholder.twitter')}
						value={twitter}
						onInput={setTwitter}
						id="twitter"
					/>
				</InputCol>
			</InputRow>
			<Button
				variant="primary"
				onClick={() => {
					handleProfileEdit();
				}}
			>
				Save Profile
			</Button>
		</SecondaryModal>
	);
};
export default EditProfileModal;

const StyledModalHeadline = styled.h1`
	font-family: 'Inter Bold';
	font-size: 2.5rem;
	color: ${({ theme }) => theme.colors.white};
`;

const StyledModalSubheadline = styled.h2`
	font-family: ${(props) => props.theme.fonts.inter};
	color: ${(props) => props.theme.colors.white};
	font-size: 14px;
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
	font-size: 0.75rem;
	color: ${({ theme }) => theme.colors.grey};
	margin: 0;
`;

const StyledInput = styled(TextInput)`
	font-family: 'Inter Bold';
	font-size: 1.5rem;
	color: ${(props) => props.theme.colors.white};
`;
