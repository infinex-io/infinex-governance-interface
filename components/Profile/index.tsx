import { ThreeDotsKebabIcon } from 'components/old-ui';
import Avatar from 'components/Avatar';
import CouncilsCarousel from 'components/CouncilsCarousel';
import { useRouter } from 'next/router';
import useUserDetailsQuery from 'queries/boardroom/useUserDetailsQuery';
import useAllCouncilMembersQuery from 'queries/members/useAllCouncilMembersQuery';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { truncateAddress } from 'utils/truncate-address';
import { ProfileForm } from 'components/Forms/ProfileForm/ProfileForm';
import { Dialog, Button, Dropdown, ExternalLink, Badge } from '@synthetixio/ui';
import useGetMemberCouncilNameQuery from 'queries/members/useGetMemberCouncilName';
import { Loader } from 'components/Loader/Loader';
import { ProfileCard } from './ProfileCard';
import styles from './Profile.module.scss';
import clsx from 'clsx';
import { compareAddress } from 'utils/helpers';
import { useAccount } from 'wagmi';
import BackButton from 'components/BackButton';

export default function ProfileSection({ walletAddress }: { walletAddress: string }) {
	const { t } = useTranslation();
	const { push } = useRouter();
	const { data } = useAccount();
	const userDetailsQuery = useUserDetailsQuery(walletAddress);
	const [isOpen, setIsOpen] = useState(false);
	const allMembers = useAllCouncilMembersQuery();

	const isOwnCard = compareAddress(walletAddress, data?.address);

	const councilMembersQuery = useGetMemberCouncilNameQuery(walletAddress);
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
			<div className="flex flex-col md:items-center align-center">
				<BackButton />
				<div
					className={clsx('w-full h-full bg-center bg-no-repeat flex flex-col items-center', {
						'bg-[url(/images/ring-orange.svg)]': isOwnCard,
						'bg-[url(/images/ring.svg)]': !isOwnCard,
					})}
				>
					<Avatar scale={10} url={pfpThumbnailUrl} walletAddress={walletAddress} />
					{councilMembersQuery.data && (
						<Badge variant="success" className="mt-3 max-w-[150px]">
							{t('profiles.council', { council: councilMembersQuery.data })}
						</Badge>
					)}
					<div className="flex flex-col justify-between items-center p-3">
						<div className="flex items-center mt-3">
							<h4 className="tg-title-h4 mr-3">
								{username || ens || truncateAddress(walletAddress)}
							</h4>
							<Dropdown
								triggerElement={
									<div className="flex items-center hover:brightness-150 transition-colors justify-center cursor-pointer rounded bg-dark-blue w-[28px] h-[28px]">
										<ThreeDotsKebabIcon />
									</div>
								}
								contentClassName={clsx('bg-navy flex flex-col', styles.dropdown)}
								triggerElementProps={({ isOpen }: any) => ({ isActive: isOpen })}
								contentAlignment="right"
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
				</div>
				<div className="flex flex-col mb-6 w-full p-3 max-w-[1200px]">
					<h4 className="tg-title-h4 text-start">{t('profiles.subheadline')}</h4>
					<div className="relative flex flex-col items-center">
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
							className="max-w-[1200px]"
						/>
					</div>
				</div>
				<hr className="border-gray-700 my-4 w-full p-3" />
				<CouncilsCarousel />
				<Button className="max-w-[250px] my-8" onClick={() => push({ pathname: '/councils' })}>
					{t('profiles.view-all-members')}
				</Button>
			</div>
		);
	} else {
		return <Loader fullScreen />;
	}
}
