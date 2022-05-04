import Avatar from 'components/Avatar';
import EditProfileModal from 'components/Modals/EditProfile';
import Modal from 'containers/Modal';
import useUserDetailsQuery from 'queries/boardroom/useUserDetailsQuery';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

export default function ProfileSection({ walletAddress }: { walletAddress: string }) {
	const { t } = useTranslation();

	const userDetailsQuery = useUserDetailsQuery(walletAddress);
	const { setIsOpen, setContent } = Modal.useContainer();

	if (userDetailsQuery.isSuccess && userDetailsQuery.data) {
		const {
			address,
			pfpThumbnailUrl,
			username,
			ens,
			about,
			twitter,
			discord,
			delegationPitches,
			github,
		} = userDetailsQuery.data;

		let parsedDelegationPitch = {
			synthetix: '',
		};

		if (delegationPitches !== '') {
			parsedDelegationPitch = JSON.parse(delegationPitches);
		}

		return (
			<Page>
				<FlexCol>
					<button
						onClick={() => {
							setContent(<EditProfileModal userProfile={userDetailsQuery.data} />);
							setIsOpen(true);
						}}
					>
						Edit Profile
					</button>
					<Avatar url={pfpThumbnailUrl} walletAddress={walletAddress} />
					<StyledHeadline>{username ? username : ens ? ens : walletAddress}</StyledHeadline>
					<StyledSubline>{about}</StyledSubline>
					<StyledHeadline>{t('profiles.subheadline')}</StyledHeadline>
					<ProfileBox>
						<FlexRow>
							<Avatar url={pfpThumbnailUrl} walletAddress={walletAddress} />
							<FlexCol>
								<InfoHeader>{t('profiles.discord')}</InfoHeader>
								<InfoData>{discord}</InfoData>
							</FlexCol>
							<FlexCol>
								<InfoHeader>{t('profiles.github')}</InfoHeader>
								<InfoData>{github}</InfoData>
							</FlexCol>
							<FlexCol>
								<InfoHeader>{t('profiles.twitter')}</InfoHeader>
								<InfoData>{twitter}</InfoData>
							</FlexCol>
							<FlexCol>
								<InfoHeader>{t('profiles.currentVotingWeight')}</InfoHeader>
								<InfoData>{12241}</InfoData>
							</FlexCol>
							<FlexCol>
								<InfoHeader>{t('profiles.participatedVotes')}</InfoHeader>
								<InfoData>{1242112}</InfoData>
							</FlexCol>
						</FlexRow>
						<FlexRow>
							<FlexCol>
								<InfoHeader>{t('profiles.wallet')}</InfoHeader>
								<InfoData>{address}</InfoData>
							</FlexCol>
						</FlexRow>
						<FlexRow>
							<FlexCol>
								<InfoHeader>{t('profiles.pitch')}</InfoHeader>
								<InfoData>{parsedDelegationPitch.synthetix}</InfoData>
							</FlexCol>
						</FlexRow>
					</ProfileBox>
				</FlexCol>
			</Page>
		);
	} else {
		return <></>;
	}
}

const FlexCol = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

// @DEV - Mati can remove but just made it so its less squishy
const Page = styled(FlexCol)`
	height: 100vh;
`;

const FlexRow = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
`;

const StyledHeadline = styled.h1``;
const StyledSubline = styled.h2`
	color: ${(props) => props.theme.colors.grey};
	font-size: 14px;
`;

const ProfileBox = styled(FlexCol)`
	display: flex;
	flex-direction: column;
`;

const InfoHeader = styled.div`
	font-family: ${(props) => props.theme.fonts.interBold};
	font-weight: 700;
	font-size: 14px;
	line-height: 21px;
	color: ${(props) => props.theme.colors.grey};
`;

const InfoData = styled.div`
	font-family: ${(props) => props.theme.fonts.interBold};
	font-weight: 700;
	font-size: 24px;
	line-height: 21px;
	color: ${(props) => props.theme.colors.white};
`;
