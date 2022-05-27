import { Button, IconButton, useTransactionModalContext } from '@synthetixio/ui';
import Avatar from 'components/Avatar';
import { CloseIcon } from 'components/old-ui';
import { useModalContext } from 'containers/Modal';
import { DeployedModules } from 'containers/Modules';
import useWithdrawVoteMutation from 'mutations/voting/useWithdrawVoteMutation';
import { useRouter } from 'next/router';
import { GetUserDetails } from 'queries/boardroom/useUserDetailsQuery';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { capitalizeString } from 'utils/capitalize';
import { truncateAddress } from 'utils/truncate-address';

interface WithdrawVoteProps {
	member: Pick<GetUserDetails, 'address' | 'ens' | 'pfpThumbnailUrl'>;
	council: string;
	deployedModule: DeployedModules;
}

export default function WithdrawVoteModal({ member, council, deployedModule }: WithdrawVoteProps) {
	const { t } = useTranslation();
	const { push } = useRouter();
	const { setIsOpen } = useModalContext();
	const queryClient = useQueryClient();
	const { state, setContent, setTxHash, setVisible, setState, visible } =
		useTransactionModalContext();
	const withdrawVoteMutation = useWithdrawVoteMutation(deployedModule);
	useEffect(() => {
		if (state === 'confirmed' && visible) {
			setTimeout(() => {
				queryClient.refetchQueries({
					active: true,
					stale: true,
					queryKey: ['getCurrentVoteStateQuery'],
				});
				push('/vote');
				setIsOpen(false);
				setVisible(false);
			}, 2000);
		}
	}, [state, setIsOpen, setVisible, push, visible, queryClient]);
	const handleWithdraw = async () => {
		setState('signing');
		setVisible(true);
		setContent(
			<>
				<h6 className="tg-title-h6">
					{t('modals.withdraw-vote.cta', { council: capitalizeString(council) })}
				</h6>
				<h3 className="tg-title-h3">{member.ens || truncateAddress(member.address)}</h3>
			</>
		);
		const tx = await withdrawVoteMutation.mutateAsync();
		setTxHash(tx.hash);
	};
	return (
		<div className="p-1 h-full bg-purple relative rounded">
			<IconButton className="absolute right-2 top-2" rounded onClick={() => setIsOpen(false)}>
				<CloseIcon active />
			</IconButton>
			<div className="darker-60 min-w-full min-h-full flex flex-col items-center rounded pt-40">
				<h1 className="tg-title-h1 text-white">{t('modals.withdraw-vote.headline')}</h1>
				<Avatar
					width={160}
					height={160}
					walletAddress={member.address}
					url={member.pfpThumbnailUrl}
				/>
				<div className="bg-black max-w-[350px] p-8 text-white m-4">
					<h6 className="tg-title-h6 text-center">
						{t('modals.withdraw-vote.voted-for', {
							council: capitalizeString(council),
						})}
					</h6>
					<h3 className="tg-title-h3 text-center">
						{member.ens || truncateAddress(member.address)}
					</h3>
				</div>
				<Button size="lg" onClick={handleWithdraw}>
					{t('modals.withdraw-vote.uncast-vote')}
				</Button>
			</div>
		</div>
	);
}
