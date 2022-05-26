import {
	ArrowLeftIcon,
	Flex,
	IconButton,
	ThreeDotsKebabIcon,
	Dropdown,
	Card as OldCard,
} from 'components/old-ui';
import Avatar from 'components/Avatar';
import CouncilsCarousel from 'components/CouncilsCarousel';
import { useConnectorContext } from 'containers/Connector';
import { useRouter } from 'next/router';
import useUserDetailsQuery from 'queries/boardroom/useUserDetailsQuery';
import useAllCouncilMembersQuery from 'queries/members/useAllCouncilMembersQuery';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { truncateAddress } from 'utils/truncate-address';
import { ProfileForm } from 'components/Forms/ProfileForm/ProfileForm';
import { Dialog, Button, Spinner, Card } from '@synthetixio/ui';
import useGetMemberCouncilNameQuery from 'queries/members/useGetMemberCouncilName';
import Link from 'next/link';
import { Loader } from 'components/Loader/Loader';
import { ProfileCard } from './ProfileCard';

export default function ProfileSection({ walletAddress }: { walletAddress: string }) {
	const { t } = useTranslation();
	const { push } = useRouter();
	const userDetailsQuery = useUserDetailsQuery(walletAddress);
	const [isOpen, setIsOpen] = useState(false);
	const [dropDownOpen, setDropDownOpen] = useState(false);
	const { walletAddress: ownAddress } = useConnectorContext();
	const allMembers = useAllCouncilMembersQuery();

	const { data } = useGetMemberCouncilNameQuery(walletAddress);
	if (userDetailsQuery.isSuccess && userDetailsQuery.data && allMembers.isSuccess) {
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

		if (delegationPitches) {
			parsedDelegationPitch = JSON.parse(delegationPitches);
		}

		const getDropdownElements = () => {
			const elements = [
				<Link
					href={`https://optimistic.etherscan.io/address/${address}`}
					key="profile-etherscan-link"
				>
					Etherscan
				</Link>,
			];
			if (discord)
				elements.unshift(
					<Link href={`https://discord.com/${discord}`} key="discord-link">
						Discord
					</Link>
				);
			if (twitter)
				elements.unshift(
					<Link href={`https://twitter.com/${twitter}`} key="twitter-link">
						Twitter
					</Link>
				);
			return elements;
		};
		return (
			<div className="flex flex-col items-center pb-20">
				<div className="flex items-center absolute left-10 top-10">
					<IconButton
						className="mr-2"
						active
						onClick={() => push({ pathname: '/' })}
						rounded
						size="tiniest"
					>
						<ArrowLeftIcon active />
					</IconButton>
					<span className="tg-content-bold text-blue">{t('councils.back-btn')}</span>
				</div>
				<StyledAvatarWrapper
					isOwnAccount={ownAddress === walletAddress}
					direction="column"
					alignItems="center"
				>
					<Avatar width={90} height={90} url={pfpThumbnailUrl} walletAddress={walletAddress} />
					{data && (
						<OldCard color="green" className="mt-3 max-w-[150px]">
							<div className="tg-subhead darker-60 text-center text-green">
								{t('profiles.council', { council: data })}
							</div>
						</OldCard>
					)}
					<div className="flex flex-col justify-between items-center relative">
						<div className="flex items-center mt-3">
							<h4 className="tg-title-h4 mr-3">
								{username ? username : ens ? ens : truncateAddress(walletAddress)}
							</h4>

							<div
								className="flex items-center hover:brightness-150 transition-colors justify-center cursor-pointer rounded bg-dark-blue w-[28px] h-[28px]"
								onClick={() => {
									if (ownAddress === walletAddress) setIsOpen(true);
									else setDropDownOpen(!dropDownOpen);
								}}
							>
								<ThreeDotsKebabIcon />
							</div>
						</div>

						{dropDownOpen && <Dropdown color="lightBlue" elements={getDropdownElements()} />}
						<Dialog wrapperClass="max-w-[700px]" onClose={() => setIsOpen(false)} open={isOpen}>
							<ProfileForm userProfile={userDetailsQuery.data} />
						</Dialog>
					</div>
					<p className="tg-body">{about}</p>
				</StyledAvatarWrapper>
				<div className="flex flex-col mb-6">
					<h4 className="tg-headline text-start">{t('profiles.subheadline')}</h4>
					<ProfileCard
						pfpThumbnailUrl={pfpThumbnailUrl}
						walletAddress={walletAddress}
						discord={discord}
						github={github}
						twitter={twitter}
						pitch={parsedDelegationPitch.synthetix}
					/>
				</div>
				<CouncilsCarousel />
				<Button className="max-w-[250px]" onClick={() => push({ pathname: '/councils' })}>
					{t('profiles.view-all-members')}
				</Button>
			</div>
		);
	} else {
		return <Loader fullScreen />;
	}
}

const StyledAvatarWrapper = styled(Flex)<{ isOwnAccount?: boolean }>`
	background-image: ${({ isOwnAccount }) =>
		isOwnAccount ? 'url(/images/ring-orange.svg)' : 'url(/images/ring.svg)'};
	max-width: 780px;
	width: 100%;
	height: 100%;
	background-position: bottom center;
	background-repeat: no-repeat;
`;
