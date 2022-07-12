import Avatar from 'components/Avatar';
import CouncilsCarousel from 'components/CouncilsCarousel';
import { useRouter } from 'next/router';
import useUserDetailsQuery from 'queries/boardroom/useUserDetailsQuery';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { truncateAddress } from 'utils/truncate-address';
import { ProfileForm } from 'components/Forms/ProfileForm/ProfileForm';
import { Dialog, Button, Dropdown, ExternalLink, Badge, IconButton, Icon } from '@synthetixio/ui';
import useGetMemberCouncilNameQuery from 'queries/members/useGetMemberCouncilName';
import { Loader } from 'components/Loader/Loader';
import { ProfileCard } from './ProfileCard';
import clsx from 'clsx';
import { compareAddress, urlIsCorrect } from 'utils/helpers';
import { useAccount } from 'wagmi';
import Image from 'next/image';
import { useModalContext } from 'containers/Modal';
import WithdrawNominationModal from 'components/Modals/WithdrawNomination';
import useIsNominated from 'queries/nomination/useIsNominatedQuery';
import useCurrentPeriod from 'queries/epochs/useCurrentPeriodQuery';
import { COUNCILS_DICTIONARY } from 'constants/config';
import { useConnectorContext } from 'containers/Connector';
import { DeployedModules } from 'containers/Modules';

export default function ProfileSection({ walletAddress }: { walletAddress: string }) {
	const { t } = useTranslation();
	const { push } = useRouter();
	const { data } = useAccount();
	const { ensName } = useConnectorContext();
	const { setContent, setIsOpen: setModalOpen } = useModalContext();
	const userDetailsQuery = useUserDetailsQuery(walletAddress);
	const [isOpen, setIsOpen] = useState(false);
	const isOwnCard = compareAddress(walletAddress, data?.address);
	const councilMembersQuery = useGetMemberCouncilNameQuery(walletAddress);
	const spartan = useIsNominated(DeployedModules.SPARTAN_COUNCIL, walletAddress);
	const grants = useIsNominated(DeployedModules.GRANTS_COUNCIL, walletAddress);
	const ambassador = useIsNominated(DeployedModules.AMBASSADOR_COUNCIL, walletAddress);
	const treasury = useIsNominated(DeployedModules.TREASURY_COUNCIL, walletAddress);
	const councilNomination = [spartan.data, grants.data, ambassador.data, treasury.data];
	const { data: allPeriods } = useCurrentPeriod();
	const isNominatedFor = COUNCILS_DICTIONARY.map((council, index) => ({
		nominated: councilNomination && Array.isArray(councilNomination) && councilNomination[index],
		period: allPeriods && Array.isArray(allPeriods) && allPeriods[index][council.slug],
		council: council.label,
		module: council.module,
	})).filter((v) => v.nominated && v.period === 'NOMINATION');

	if (userDetailsQuery.isSuccess && userDetailsQuery.data) {
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
			<div className="flex flex-col md:items-center align-center pt-12">
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
								{username || ensName || truncateAddress(walletAddress)}
							</h4>
							<Dropdown
								triggerElement={
									<IconButton variant="dark-blue">
										<Icon className="text-xl" name="Vertical" />
									</IconButton>
								}
								contentClassName="bg-navy flex flex-col dropdown-border overflow-hidden"
								triggerElementProps={({ isOpen }: any) => ({ isActive: isOpen })}
								contentAlignment="right"
							>
								<>
									{twitter && urlIsCorrect(twitter, 'https://twitter.com') && (
										<ExternalLink
											link={twitter}
											className="hover:bg-navy-dark-1 rounded-none"
											text="Twitter"
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
						<Dialog
							className="overflow-auto"
							wrapperClass="max-w-[700px]"
							onClose={() => setIsOpen(false)}
							open={isOpen}
						>
							<ProfileForm userProfile={userDetailsQuery.data} />
						</Dialog>
					</div>
					<p className="tg-body py-8 text-center max-w-[1000px]">{about}</p>
				</div>
				<div className="container">
					{isOwnCard && !!isNominatedFor?.length && (
						<div className="p-2 w-full">
							<div className="bg-dark-blue w-full border border-gray-800 flex flex-col md:p-8 md:pb-4 rounded-lg p-4">
								<div className="flex flex-col">
									<div className="flex w-full items-center gap-2">
										{calculatePercentage() === '100%' ? (
											<Image src="/images/tick.svg" width={44} height={44} alt="tick" />
										) : (
											<Image
												src="/images/pending.svg"
												width={94}
												height={94}
												alt="pending updates"
											/>
										)}
										<div className="flex flex-col">
											<h4 className="tg-title-h4">
												{t('profiles.completion-card.headline', {
													percentage: calculatePercentage(),
												})}
											</h4>
											<span className="tg-content text-gray-500 pt-1">
												{t('profiles.completion-card.subline')}
											</span>
										</div>
									</div>
									<div className="flex items-center w-full flex-wrap lg:flex-nowrap justify-center">
										<div className="w-full md:mr-6 md:my-6 m-2 border-gray-500 flex border rounded p-2 py-4 items-center max-w-[210px] gap-2 h-[74px]">
											<Image src="/images/profile.svg" width={24} height={24} alt="pitch" />
											<h6 className="tg-title-h6 mr-auto">{t('profiles.completion-card.pitch')}</h6>
											{delegationPitch ? (
												<Image src="/images/tick.svg" width={24} height={24} alt="tick" />
											) : (
												<IconButton rounded size="sm" onClick={() => setIsOpen(true)}>
													<Icon name="Plus" className="text-primary" />
												</IconButton>
											)}
										</div>
										<div className="w-full md:mr-6 md:my-6 m-2 border-gray-500 flex border rounded p-2 py-4 gap-2 items-center max-w-[210px] h-[74px]">
											<Image src="/images/discord.svg" width={24} height={24} alt="discord" />
											<h6 className="tg-title-h6 mr-auto">
												{t('profiles.completion-card.discord')}
											</h6>
											{discord ? (
												<Image src="/images/tick.svg" width={24} height={24} alt="tick" />
											) : (
												<IconButton rounded size="sm" onClick={() => setIsOpen(true)}>
													<Icon name="Plus" className="text-primary" />
												</IconButton>
											)}
										</div>
										<div className="w-full md:mr-6 md:my-6 m-2 border-gray-500 flex border rounded p-2 py-4 gap-2 items-center max-w-[210px] h-[74px]">
											<Image src="/images/twitter.svg" width={24} height={24} alt="twitter" />
											<h6 className="tg-title-h6 mr-auto">
												{t('profiles.completion-card.twitter')}
											</h6>
											{twitter ? (
												<Image src="/images/tick.svg" width={24} height={24} alt="tick" />
											) : (
												<IconButton rounded size="sm" onClick={() => setIsOpen(true)}>
													<Icon name="Plus" className="text-primary" />
												</IconButton>
											)}
										</div>
										<Button
											variant="outline"
											size="md"
											className="max-w-[180px] m-2"
											onClick={() => {
												if (isNominatedFor?.length) {
													setContent(
														<WithdrawNominationModal
															council={isNominatedFor[0].council}
															deployedModule={isNominatedFor[0].module}
														/>
													);
													setModalOpen(true);
												}
											}}
										>
											{t('profiles.completion-card.withdraw')}
										</Button>
									</div>
								</div>
							</div>
						</div>
					)}
					<div className="flex flex-col mb-6 w-full p-2 max-w-[1000px] mx-auto">
						<h4 className="tg-title-h4 text-start my-2">{t('profiles.subheadline')}</h4>
						<div className="relative flex flex-col items-center w-full">
							{isOwnCard && (
								<IconButton
									className="absolute top-5 right-3"
									onClick={() => setIsOpen(true)}
									size="sm"
								>
									<Icon name="Edit" />
								</IconButton>
							)}

							<ProfileCard
								pfpThumbnailUrl={pfpThumbnailUrl}
								walletAddress={walletAddress}
								discord={discord}
								github={github}
								twitter={twitter}
								pitch={delegationPitch}
								deployedModule={!!isNominatedFor.length ? isNominatedFor[0].module : undefined}
							/>
						</div>
					</div>
					<hr className="border-gray-700 my-4 w-full" />
					<CouncilsCarousel />
					<Button className="mx-auto my-8 mt-12" onClick={() => push('/councils')} size="lg">
						{t('profiles.view-all-members')}
					</Button>
				</div>
			</div>
		);
	} else {
		return <Loader fullScreen />;
	}
}
