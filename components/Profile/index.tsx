import { ArrowLeftIcon, Flex, IconButton, ThreeDotsKebabIcon } from 'components/old-ui';
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
import { Dialog, Button, Dropdown, ExternalLink, Badge } from '@synthetixio/ui';
import useGetMemberCouncilNameQuery from 'queries/members/useGetMemberCouncilName';
import { Loader } from 'components/Loader/Loader';
import { ProfileCard } from './ProfileCard';
import styles from './Profile.module.scss';
import clsx from 'clsx';
import { compareAddress } from 'utils/helpers';

export default function ProfileSection({ walletAddress }: { walletAddress: string }) {
	const { t } = useTranslation();
	const { push } = useRouter();
	const userDetailsQuery = useUserDetailsQuery(walletAddress);
	const [isOpen, setIsOpen] = useState(false);
	const { walletAddress: ownAddress } = useConnectorContext();
	const allMembers = useAllCouncilMembersQuery();

	const isOwnCard = compareAddress(walletAddress, ownAddress);

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
				<StyledAvatarWrapper isOwnAccount={isOwnCard} direction="column" alignItems="center">
					<Avatar width={90} height={90} url={pfpThumbnailUrl} walletAddress={walletAddress} />
					{data && (
						<Badge variant="success" className="mt-3 max-w-[150px]">
							{t('profiles.council', { council: data })}
						</Badge>
					)}
					<div className="flex flex-col justify-between items-center relative">
						<div className="flex items-center mt-3">
							<h4 className="tg-title-h4 mr-3">
								{username ? username : ens ? ens : truncateAddress(walletAddress)}
							</h4>

							<Dropdown
								triggerElement={
									<div className="flex items-center hover:brightness-150 transition-colors justify-center cursor-pointer rounded bg-dark-blue w-[28px] h-[28px]">
										<ThreeDotsKebabIcon />
									</div>
								}
								contentClassName={clsx('bg-navy flex flex-col', styles.dropdown)}
								triggerElementProps={({ isOpen }: any) => ({ isActive: isOpen })}
							>
								<>
									{twitter && (
										<ExternalLink
											link={`https://twitter.com/${twitter}`}
											className="hover:bg-navy-dark-1 rounded-none"
											text="Twitter"
											withoutIcon
										/>
									)}
									{discord && (
										<ExternalLink
											link={`https://discord.com/${discord}`}
											className="hover:bg-navy-dark-1 bg-navy-light-1 rounded-none"
											text="Discord"
											withoutIcon
										/>
									)}

									{address && (
										<ExternalLink
											link={`https://optimistic.etherscan.io/address/${address}`}
											className="hover:bg-navy-dark-1 rounded-none"
											text="Etherscan"
											withoutIcon
										/>
									)}
								</>
							</Dropdown>
						</div>

						<Dialog wrapperClass="max-w-[700px]" onClose={() => setIsOpen(false)} open={isOpen}>
							<ProfileForm userProfile={userDetailsQuery.data} />
						</Dialog>
					</div>
					<p className="tg-body">{about}</p>
				</StyledAvatarWrapper>
				<div className="flex flex-col mb-6 max-w-[900px] w-full">
					<h4 className="tg-headline text-start">{t('profiles.subheadline')}</h4>
					<div className="relative">
						{isOwnCard && (
							<div
								className="absolute top-5 right-3 flex items-center hover:brightness-150 transition-colors justify-center cursor-pointer rounded w-[28px] h-[28px]"
								onClick={() => setIsOpen(true)}
							>
								<ThreeDotsKebabIcon />
							</div>
						)}
						<ProfileCard
							pfpThumbnailUrl={pfpThumbnailUrl}
							walletAddress={walletAddress}
							discord={discord}
							github={github}
							twitter={twitter}
							pitch={parsedDelegationPitch.synthetix}
						/>
					</div>
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
