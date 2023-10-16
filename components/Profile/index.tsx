import Avatar from 'components/Avatar';
import CouncilsCarousel from 'components/CouncilsCarousel';
import { useRouter } from 'next/router';
import useUserDetailsQuery from 'queries/boardroom/useUserDetailsQuery';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { truncateAddress } from 'utils/truncate-address';
import { ProfileForm } from 'components/Forms/ProfileForm/ProfileForm';
import { Dialog, Dropdown, ExternalLink, Badge, IconButton, Icon } from '@synthetixio/ui';
import { Button } from 'components/button';
import useGetMemberCouncilNameQuery from 'queries/members/useGetMemberCouncilName';
import { Loader } from 'components/Loader/Loader';
import { ProfileCard } from './ProfileCard';
import clsx from 'clsx';
import { compareAddress, urlIsCorrect } from 'utils/helpers';
import { useConnectorContext } from 'containers/Connector';
import Image from 'next/image';
import { useModalContext } from 'containers/Modal';
import WithdrawNominationModal from 'components/Modals/WithdrawNomination';
import { useCurrentPeriods } from 'queries/epochs/useCurrentPeriodQuery';
import { COUNCILS_DICTIONARY } from 'constants/config';
import { useIsNominatedCouncils } from 'queries/nomination/useIsNominatedCouncils';
import { capitalizeString } from 'utils/capitalize';

export default function ProfileSection({ walletAddress }: { walletAddress: string }) {
	const { t } = useTranslation();
	const { walletAddress: userAddress } = useConnectorContext();
	const { ensName } = useConnectorContext();
	const { setContent, setIsOpen: setModalOpen } = useModalContext();
	const userDetailsQuery = useUserDetailsQuery(walletAddress);
	const [isOpen, setIsOpen] = useState(false);
	const isOwnCard = compareAddress(walletAddress, userAddress);
	const councilMembersQuery = useGetMemberCouncilNameQuery(walletAddress);
	const periodsData = useCurrentPeriods();

	const { trade, ecosystem, coreContributor, treasury } = useIsNominatedCouncils(walletAddress);
	const councilNomination = [trade.data, ecosystem.data, coreContributor.data, treasury.data];

	const isNominatedFor = COUNCILS_DICTIONARY.map((council, index) => ({
		nominated: councilNomination && Array.isArray(councilNomination) && councilNomination[index],
		period: periodsData[index].data?.currentPeriod,
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
				<div className='w-full h-full bg-center bg-no-repeat flex flex-col items-center'>
					<Avatar scale={10} url={pfpThumbnailUrl} walletAddress={walletAddress} />
					{councilMembersQuery.data && (
						<span
							className="bg-[#15262A] text-[#31C690] p-2 rounded font-medium text-xs text-center mt-3 w-fit self-center"
							data-testid="cta-text"
						>
							{t('profiles.council', { council: capitalizeString(councilMembersQuery.data) })}

						</span>
					)}
					<div className="flex flex-col justify-between items-center p-3">
						<div className="flex items-center mt-3">
							<h4 className="tg-title-h4 mr-3">
								{username || ensName || truncateAddress(walletAddress)}
							</h4>
							<Dropdown
								triggerElement={
									<IconButton className="bg-transparent focus:text-slate-300 hover:border-slate-800 
									focus:border-slate-600">
										<Icon className="text-xl" name="Vertical" />
									</IconButton>
								}
								contentClassName="bg-slate-1000 flex flex-col dropdown-border overflow-hidden"
								triggerElementProps={({ isOpen }: any) => ({ isActive: isOpen })}
								contentAlignment="right"
							>
								<>
									{twitter && urlIsCorrect(twitter, 'https://twitter.com') && (
										<ExternalLink
											link={twitter}
											className="hover:bg-slate-900 rounded-none text-slate-200"
											text="Twitter"
											withoutIcon
										/>
									)}
									{address && (
										<ExternalLink
											link={`https://optimistic.etherscan.io/address/${address}`}
											className="hover:bg-slate-900 rounded-none text-slate-200"
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
							<ProfileForm userProfile={userDetailsQuery.data} setIsOpen={setIsOpen} />
						</Dialog>
					</div>
					<p className="tg-body py-8 text-center max-w-[1000px]">{about}</p>
				</div>
				<div className="container">
					{isOwnCard && !!isNominatedFor?.length && (
						<div className="p-2 w-full">
							<div className="bg-slate-900 w-full border border-gray-800 flex flex-col items-center md:p-8 md:pb-4 rounded-lg p-4">
								<div className="flex justify-center w-full items-center gap-2 text-center mb-8">
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
									<div className="w-full md:mr-6 md:my-6 m-2 border-gray-500 flex border rounded p-3 gap-5 items-center max-w-[210px] gap-2 h-[60px]">
										<Image src="/images/profile.svg" width={24} height={24} alt="pitch" />
										<h6 className="tg-title-h6 mr-auto">{t('profiles.completion-card.pitch')}</h6>
										{delegationPitch ? (
											<Image src="/images/tick.svg" width={24} height={24} alt="tick" />
										) : (
											<IconButton rounded className="bg-transparent" size="xs" onClick={() => setIsOpen(true)}>
												<Icon name="Plus" className="text-primary" />
											</IconButton>
										)}
									</div>
									<div className="w-full md:mr-6 md:my-6 m-2 border-gray-500 flex border rounded p-3 gap-5 items-center max-w-[210px] h-[60px]">
										<Image src="/images/discord.svg" width={24} height={24} alt="discord" />
										<h6 className="tg-title-h6 mr-auto">
											{t('profiles.completion-card.discord')}
										</h6>
										{discord ? (
											<Image src="/images/tick.svg" width={24} height={24} alt="tick" />
										) : (
											<IconButton rounded size="xs" className="bg-transparent" onClick={() => setIsOpen(true)}>
												<Icon name="Plus" className="text-primary" />
											</IconButton>
										)}
									</div>
									<div className="w-full md:mr-6 md:my-6 m-2 border-gray-500 flex border rounded p-3 gap-5 items-center max-w-[210px] h-[60px]">
										<Image src="/images/twitter.svg" width={24} height={24} alt="twitter" />
										<h6 className="tg-title-h6 mr-auto">
											{t('profiles.completion-card.twitter')}
										</h6>
										{twitter ? (
											<Image src="/images/tick.svg" width={24} height={24} alt="tick" />
										) : (
											<IconButton rounded size="xs" className="bg-transparent" onClick={() => setIsOpen(true)}>
												<Icon name="Plus" className="text-primary" />
											</IconButton>
										)}
									</div>
									
								</div>
								<Button
										variant="destructive"
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
										label={t('profiles.completion-card.withdraw') as string}
									/>
							</div>
						</div>
					)}
					<div className="flex flex-col mb-6 w-full p-2 max-w-[1000px] mx-auto">
						<h4 className="tg-title-h4 text-start my-2">{t('profiles.subheadline')}</h4>
						<div className="relative flex flex-col items-center w-full">
							{isOwnCard && (
								<IconButton
									className="bg-transparent absolute top-5 right-3"
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
				</div>
			</div>
		);
	} else {
		return <Loader fullScreen />;
	}
}
