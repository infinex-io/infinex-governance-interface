import { DeployedModules } from 'containers/Modules';
import { useRouter } from 'next/router';
import useUserDetailsQuery from 'queries/boardroom/useUserDetailsQuery';
import { useTranslation } from 'react-i18next';
import { Badge, Dropdown, Icon, IconButton } from '@synthetixio/ui';
import Avatar from 'components/Avatar';
import { truncateAddress } from 'utils/truncate-address';
import { COUNCILS_DICTIONARY } from 'constants/config';
import { useModalContext } from 'containers/Modal';
import WithdrawVote from 'components/Modals/WithdrawVote';

interface Props {
	hasVoted: boolean;
	council: DeployedModules;
	periodIsVoting: boolean;
	walletAddress: string;
}

export const VoteCard: React.FC<Props> = ({ hasVoted, council, periodIsVoting, walletAddress }) => {
	const { t } = useTranslation();
	const userDetailsQuery = useUserDetailsQuery(walletAddress);
	const { setContent, setIsOpen } = useModalContext();
	const { push } = useRouter();
	const activeCouncil =
		COUNCILS_DICTIONARY.find((c) => c.module === council) || COUNCILS_DICTIONARY[0];

	if (!periodIsVoting)
		return (
			<h6 className="tg-title-h6">{t('vote.not-in-voting', { council: activeCouncil.label })}</h6>
		);

	if (userDetailsQuery.isLoading) return null;

	return hasVoted && userDetailsQuery.data ? (
		<div className="bg-black md:max-w-[230px] p-2 w-full rounded border border-solid border-gray-900 flex items-center justify-between relative">
			<Avatar
				walletAddress={userDetailsQuery.data.address}
				url={userDetailsQuery.data.pfpThumbnailUrl}
				width={33}
				height={33}
				scale={4}
			/>
			<div className="flex flex-col">
				<span className="tg-caption-bold text-primary">
					{t(`vote.councils.${activeCouncil.abbreviation}`)}
				</span>
				<span className="tg-content">
					{userDetailsQuery.data?.ens || truncateAddress(userDetailsQuery.data.address)}
				</span>
			</div>

			<Dropdown
				width="sm"
				triggerElementProps={({ isOpen }: any) => ({ isActive: isOpen })}
				contentClassName="bg-slate-1000 flex flex-col dropdown-border overflow-hidden"
				triggerElement={
					<IconButton rounded size="sm" className="bg-transparent focus:border-white">
						<Icon className="text-xl !text-white" name="Vertical" />
					</IconButton>
				}
				contentAlignment="right"
				renderFunction={({ handleClose }) => (
					<div className="flex flex-col">
						<span
							className="text-sm p-2 text-slate-100 cursor-pointer"
							onClick={() => {
								handleClose();
								push('/vote/' + activeCouncil.slug);
							}}
						>
							{t('vote.dropdown.change')}
						</span>
						<span
							className="text-sm p-2 text-slate-100 bg-black cursor-pointer"
							onClick={() => {
								handleClose();
								push('/profile/' + userDetailsQuery.data?.address);
							}}
						>
							{t('vote.dropdown.view')}
						</span>
						<span
							className="text-sm p-2 text-slate-100 cursor-pointer"
							onClick={() => {
								if (!userDetailsQuery.data) return;
								handleClose();
								setContent(
									<WithdrawVote
										council={activeCouncil.label}
										deployedModule={council}
										member={userDetailsQuery.data}
									/>
								);
								setIsOpen(true);
							}}
						>
							{t('vote.dropdown.uncast')}
						</span>
					</div>
				)}
			></Dropdown>
		</div>
	) : (
	<div className="md:max-w-[220px] border-[1px] border-secondary-dark rounded bg-[#16151D] 
	w-full h-full p-1 flex items-center rounded py-2 px-5">
		<div className="flex flex-col items-center justify-center mr-auto">
			<span className="text-xs font-semibold text-white">
				{t(`vote.councils.${activeCouncil.abbreviation}`)}
			</span>
			<Badge className="mt-1 uppercase w-fit">
				{t('vote.not-voted')}
			</Badge>
		</div>
		<IconButton size="xs" className="bg-transparent" onClick={() => push('/vote/' + activeCouncil.slug)} rounded>
			<Icon name="Plus" className="text-secondary-dark" />
		</IconButton>
	</div>
	);
};
