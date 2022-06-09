import { PlusIcon, ThreeDotsKebabIcon } from 'components/old-ui';
import Avatar from 'components/Avatar';
import CouncilsCarousel from 'components/CouncilsCarousel';
import { useRouter } from 'next/router';
import useUserDetailsQuery from 'queries/boardroom/useUserDetailsQuery';
import useAllCouncilMembersQuery from 'queries/members/useAllCouncilMembersQuery';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { truncateAddress } from 'utils/truncate-address';
import { ProfileForm } from 'components/Forms/ProfileForm/ProfileForm';
import { Dialog, Button, Dropdown, ExternalLink, Badge, Card, IconButton } from '@synthetixio/ui';
import useGetMemberCouncilNameQuery from 'queries/members/useGetMemberCouncilName';
import { Loader } from 'components/Loader/Loader';
import { ProfileCard } from './ProfileCard';
import clsx from 'clsx';
import { compareAddress } from 'utils/helpers';
import { useAccount } from 'wagmi';
import BackButton from 'components/BackButton';
import Image from 'next/image';
import useIsNominatedForCouncilInNominationPeriod from 'queries/nomination/useIsNominatedForCouncilInNominationPeriod';
import { useModalContext } from 'containers/Modal';
import WithdrawNominationModal from 'components/Modals/WithdrawNomination';

export default function ProfileSection({ walletAddress }: { walletAddress: string }) {
	const { t } = useTranslation();
	const { push } = useRouter();
	const { data } = useAccount();
	const { setContent, setIsOpen: setModalOpen } = useModalContext();
	const userDetailsQuery = useUserDetailsQuery(walletAddress);
	const [isOpen, setIsOpen] = useState(false);
	const allMembers = useAllCouncilMembersQuery();
	const isNominatedQuery = useIsNominatedForCouncilInNominationPeriod(walletAddress);
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
			delegationPitch,
			github,
		} = userDetailsQuery.data;

		const calculatePercentage = () => {
			const submissions = [delegationPitch, twitter, discord];
			if (submissions.every((v) => !v)) return '0%';
			if (submissions.filter((v) => !!v).length === 1) return '33%';
			if (submissions.filter((v) => !!v).length === 2) return '66%';
			return '100%';
		};

		return (
			<div className="flex flex-col md:items-center align-center pt-12 max-w-[1000px] mx-auto">
				<BackButton />
				<div
					className={clsx('w-full h-full bg-center bg-no-repeat flex flex-col items-center', {
						'bg-[url(/images/ring-orange.svg)]': isOwnCard,
						'bg-[url(/images/ring.svg)]': !isOwnCard,
					})}
				>
					<Avatar scale={10} url={pfpThumbnailUrl} walletAddress={walletAddress} />
					{councilMembersQuery.data && (
						<Badge variant="success" className="mt-3 max-w-[150px] uppercase tg-caption-sm">
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
								contentClassName="bg-navy flex flex-col dropdown-border overflow-hidden"
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
											link={discord}
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
				{isOwnCard && !!isNominatedQuery.data?.length && (
					<div className="p-2 w-full">
						<div className="bg-dark-blue w-full border border-gray-700 flex flex-col p-2">
							<div className="flex flex-col">
								<div className="flex w-full items-center">
									{calculatePercentage() === '100%' ? (
										<Image
											src="/images/tick.svg"
											width={44}
											height={44}
											alt="tick"
											className="m-2"
										/>
									) : (
										<Image src="/images/pending.svg" width={94} height={94} alt="pending updates" />
									)}
									<div className="flex flex-col">
										<h4 className="tg-title-h4">
											{t('profiles.completion-card.headline', {
												percentage: calculatePercentage(),
											})}
										</h4>
										<span className="tg-content text-gray-500">
											{t('profiles.completion-card.subline')}
										</span>
									</div>
								</div>
								<div className="flex items-center w-full flex-wrap lg:flex-nowrap justify-center ">
									<div className="w-full md:m-6 m-2 border-gray-500 flex border-[1px] rounded p-2 justify-between items-center max-w-[195px]">
										<Image src="/images/profile.svg" width={24} height={24} alt="pitch" />
										<h6 className="tg-title-h6">{t('profiles.completion-card.pitch')}</h6>
										{delegationPitch ? (
											<Image src="/images/tick.svg" width={24} height={24} alt="tick" />
										) : (
											<IconButton rounded size="sm" onClick={() => setIsOpen(true)}>
												<PlusIcon active />
											</IconButton>
										)}
									</div>
									<div className="w-full md:m-6 m-2 border-gray-500 flex border-[1px] rounded p-2 justify-between items-center max-w-[195px]">
										<Image src="/images/discord.svg" width={24} height={24} alt="discord" />
										<h6 className="tg-title-h6">{t('profiles.completion-card.discord')}</h6>
										{discord ? (
											<Image src="/images/tick.svg" width={24} height={24} alt="tick" />
										) : (
											<IconButton rounded size="sm" onClick={() => setIsOpen(true)}>
												<PlusIcon active />
											</IconButton>
										)}
									</div>
									<div className="w-full md:m-6 m-2 border-gray-500 flex border-[1px] rounded p-2 justify-between items-center max-w-[195px]">
										<Image src="/images/twitter.svg" width={24} height={24} alt="twitter" />
										<h6 className="tg-title-h6">{t('profiles.completion-card.twitter')}</h6>
										{twitter ? (
											<Image src="/images/tick.svg" width={24} height={24} alt="tick" />
										) : (
											<IconButton rounded size="sm" onClick={() => setIsOpen(true)}>
												<PlusIcon active />
											</IconButton>
										)}
									</div>
									<Button
										variant="outline"
										size="md"
										className="max-w-[180px]"
										onClick={() => {
											setContent(
												<WithdrawNominationModal
													council={isNominatedQuery.data[0].council}
													deployedModule={isNominatedQuery.data[0].module}
												/>
											);
											setModalOpen(true);
										}}
									>
										{t('profiles.completion-card.withdraw')}
									</Button>
								</div>
							</div>
						</div>
					</div>
				)}
				<div className="flex flex-col mb-6 w-full p-2">
					<h4 className="tg-title-h4 text-start">{t('profiles.subheadline')}</h4>
					<div className="relative flex flex-col items-center w-full">
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
							pitch={delegationPitch}
							className="max-w-[1200px]"
							deployedModule={isNominatedQuery.data && isNominatedQuery.data[0].module}
						/>
					</div>
				</div>
				<hr className="border-gray-700 my-4 w-full" />
				<CouncilsCarousel />
				<Button className="mx-auto my-8 mt-12" onClick={() => push('/councils')} size="lg">
					{t('profiles.view-all-members')}
				</Button>
			</div>
		);
	} else {
		return <Loader fullScreen />;
	}
}
