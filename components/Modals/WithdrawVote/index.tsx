import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button, useTransactionModalContext } from '@synthetixio/ui';
import Avatar from 'components/Avatar';
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
import { useAccount } from 'wagmi';
import BaseModal from '../BaseModal';

interface WithdrawVoteProps {
	member: Pick<GetUserDetails, 'address' | 'ens' | 'pfpThumbnailUrl'>;
	council: string;
	deployedModule: DeployedModules;
}

export default function WithdrawVoteModal({ member, council, deployedModule }: WithdrawVoteProps) {
	const { t } = useTranslation();
	const { push } = useRouter();
	const { setIsOpen } = useModalContext();
	const { data } = useAccount();
	const queryClient = useQueryClient();
	const { state, setContent, setTxHash, setVisible, setState, visible } =
		useTransactionModalContext();
	const withdrawVoteMutation = useWithdrawVoteMutation(deployedModule);
	useEffect(() => {
		if (state === 'confirmed' && visible) {
			queryClient.invalidateQueries(['getCurrentVoteStateQuery', data?.address]);
			queryClient
				.refetchQueries({
					active: true,
					stale: true,
					inactive: true,
					queryKey: 'getCurrentVoteStateQuery',
				})
				.then(() => {
					push('/vote');
					setIsOpen(false);
					setVisible(false);
				});
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
		try {
			const tx = await withdrawVoteMutation.mutateAsync();
			setTxHash(tx.hash);
		} catch (error) {
			console.error(error);
			setState('error');
		}
	};
	return (
		<BaseModal headline={t('modals.withdraw-vote.headline')}>
			{!data?.connector ? (
				<ConnectButton />
			) : (
				<div className="flex flex-col items-center max-w-[500px] p-2">
					<span className="text-center tg-body text-gray-500">
						{t('modals.withdraw-vote.subline')}
					</span>
					<Avatar
						scale={12}
						width={90}
						height={90}
						walletAddress={member.address}
						url={member.pfpThumbnailUrl}
						className="md:mt-14 mb-8 mt-10"
					/>
					<div className="flex flex-col items-center border-gray-700 border-[1px] rounded bg-black text-white mt-4 md:p-10 p-4 w-full">
						<h5 className="tg-title-h5 mt-4 mb-2 mx-4">
							{t('modals.withdraw-vote.voted-for', {
								council: capitalizeString(council),
							})}
						</h5>
						<h3 className="tg-title-h3 text-center">
							{member.ens || truncateAddress(member.address)}
						</h3>
					</div>
					<Button size="lg" onClick={handleWithdraw} className="m-6 w-full">
						{t('modals.withdraw-vote.uncast-vote')}
					</Button>
				</div>
			)}
		</BaseModal>
	);
}
