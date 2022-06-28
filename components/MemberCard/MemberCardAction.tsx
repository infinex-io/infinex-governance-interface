import EditModal from 'components/Modals/EditNomination';
import WithdrawNominationModal from 'components/Modals/WithdrawNomination';
import { useModalContext } from 'containers/Modal';
import { useRouter } from 'next/router';
import { GetUserDetails } from 'queries/boardroom/useUserDetailsQuery';
import { useTranslation } from 'react-i18next';
import VoteModal from 'components/Modals/Vote';
import { Button, IconButton, Dropdown, Icon } from '@synthetixio/ui';
import Link from 'next/link';
import { EpochPeriods } from 'queries/epochs/useCurrentPeriodQuery';
import { DeployedModules } from 'containers/Modules';
import WithdrawVoteModal from 'components/Modals/WithdrawVote';
import { compareAddress } from 'utils/helpers';
import clsx from 'clsx';

interface Props {
	state: keyof typeof EpochPeriods;
	deployedModule?: DeployedModules;
	isOwnCard: boolean;
	member: GetUserDetails;
	votedFor?: GetUserDetails;
	walletAddress: string;
	council?: string;
}

export const MemberCardAction: React.FC<Props> = ({
	state,
	isOwnCard,
	member,
	votedFor,
	walletAddress,
	deployedModule,
	council,
}) => {
	const { t } = useTranslation();
	const { push } = useRouter();
	const { setContent, setIsOpen } = useModalContext();
	const votedForAlready = compareAddress(votedFor?.address, walletAddress);

	return (
		<>
			{state === 'ADMINISTRATION' && (
				<div
					className={clsx('rounded', {
						'bg-dark-blue': isOwnCard,
					})}
				>
					<Button
						className="w-[130px]"
						variant="outline"
						onClick={(e) => {
							e.stopPropagation();
							push('/profile/' + member.address);
						}}
					>
						{t('councils.view-member')}
					</Button>
				</div>
			)}

			{state === 'NOMINATION' && (
				<div className="flex gap-2 items-center">
					<Button
						className={clsx({ 'w-[130px]': !isOwnCard })}
						variant="outline"
						onClick={(e) => {
							e.stopPropagation();
							if (isOwnCard) {
								setContent(<EditModal deployedModule={deployedModule!} council={council!} />);
								setIsOpen(true);
							} else {
								push('/profile/' + member.address);
							}
						}}
					>
						{isOwnCard ? t('councils.edit-nomination') : t('councils.view-nominee')}
					</Button>

					{isOwnCard && (
						<Dropdown
							triggerElement={
								<IconButton size="sm">
									<Icon className="text-xl" name="Vertical" />
								</IconButton>
							}
							contentClassName="bg-navy flex flex-col dropdown-border overflow-hidden"
							triggerElementProps={({ isOpen }: any) => ({ isActive: isOpen })}
							contentAlignment="right"
							renderFunction={({ handleClose }) => (
								<div className="flex flex-col">
									<span
										className="hover:bg-navy-dark-1 p-2 text-primary cursor-pointer"
										onClick={() => {
											handleClose();
											setContent(
												<WithdrawNominationModal
													deployedModule={deployedModule!}
													council={council!}
												/>
											);
											setIsOpen(true);
										}}
									>
										{t('councils.dropdown.withdraw')}
									</span>
									<Link href={`/profile/${member.address}`} passHref>
										<a className="hover:bg-navy-dark-1 bg-navy-light-1 p-2 text-primary cursor-pointer">
											{t('councils.dropdown.edit')}
										</a>
									</Link>
									<Link
										href={`https://optimistic.etherscan.io/address/${member.address}`}
										passHref
										key="etherscan-link"
									>
										<a
											target="_blank"
											rel="noreferrer"
											className="hover:bg-navy-dark-1 p-2 text-primary cursor-pointer"
										>
											<span key={`${member.address}-title`} color="lightBlue">
												{t('councils.dropdown.etherscan')}
											</span>
										</a>
									</Link>
								</div>
							)}
						/>
					)}
				</div>
			)}

			{state === 'VOTING' && (
				<>
					<Button
						className={clsx('w-full', { 'mr-2': isOwnCard })}
						variant="outline"
						onClick={(e) => {
							e.stopPropagation();
							if (votedForAlready) {
								setContent(
									<WithdrawVoteModal
										member={member}
										council={council!}
										deployedModule={deployedModule!}
									/>
								);
							} else {
								setContent(
									<VoteModal member={member} deployedModule={deployedModule!} council={council!} />
								);
							}
							setIsOpen(true);
						}}
					>
						{votedForAlready ? t('vote.withdraw') : t('vote.vote-nominee')}
					</Button>

					{isOwnCard && (
						<Dropdown
							triggerElement={
								<IconButton size="sm">
									<Icon className="text-xl" name="Vertical" />
								</IconButton>
							}
							contentClassName="bg-navy flex flex-col dropdown-border overflow-hidden"
							triggerElementProps={({ isOpen }: any) => ({ isActive: isOpen })}
							contentAlignment="right"
							renderFunction={() => (
								<div className="flex flex-col">
									<Link href={`/profile/${member.address}`} passHref>
										<a className="hover:bg-navy-dark-1 bg-navy-light-1 p-2 text-primary cursor-pointer">
											{t('councils.dropdown.edit')}
										</a>
									</Link>
									<Link
										href={`https://optimistic.etherscan.io/address/${member.address}`}
										passHref
										key="etherscan-link"
									>
										<a
											target="_blank"
											rel="noreferrer"
											className="hover:bg-navy-dark-1 p-2 text-primary cursor-pointer"
										>
											<span key={`${member.address}-title`} color="lightBlue">
												{t('councils.dropdown.etherscan')}
											</span>
										</a>
									</Link>
								</div>
							)}
						/>
					)}
				</>
			)}
		</>
	);
};
