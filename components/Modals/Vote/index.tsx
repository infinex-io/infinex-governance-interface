import { useModalContext } from 'containers/Modal';
import { useRouter } from 'next/router';
import { GetUserDetails } from 'queries/boardroom/useUserDetailsQuery';
import { useTranslation } from 'react-i18next';
import BaseModal from '../BaseModal';
import useCastMutation from 'mutations/voting/useCastMutation';
import { DeployedModules } from 'containers/Modules/Modules';
import { truncateAddress } from 'utils/truncate-address';
import { capitalizeString } from 'utils/capitalize';
import Avatar from 'components/Avatar';
import { Button, useTransactionModalContext } from '@synthetixio/ui';
import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useModulesContext } from 'containers/Modules/index';
import { getCrossChainClaim } from 'mutations/voting/useCastMutation';
import { BigNumber } from 'ethers';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface VoteModalProps {
	member: Pick<GetUserDetails, 'address' | 'ens' | 'pfpThumbnailUrl' | 'about'>;
	deployedModule: DeployedModules;
	council: string;
}

export default function VoteModal({ member, deployedModule, council }: VoteModalProps) {
	const { t } = useTranslation();
	const { setIsOpen } = useModalContext();
	const { data } = useAccount();
	const governanceModules = useModulesContext();
	const [votingPower, setVotingPower] = useState({ l1: BigNumber.from(0), l2: BigNumber.from(0) });
	const { push } = useRouter();
	const queryClient = useQueryClient();
	const castVoteMutation = useCastMutation(deployedModule);
	const { setVisible, setContent, state, setTxHash, visible, setState } =
		useTransactionModalContext();
	useEffect(() => {
		if (state === 'confirmed' && visible) {
			setTimeout(() => {
				queryClient.resetQueries({
					active: true,
					stale: true,
					queryKey: 'getCurrentVoteStateQuery',
				});
				push('/profile/' + member.address);
				setVisible(false);
				setIsOpen(false);
			}, 2000);
		}
	}, [state, setVisible, setIsOpen, push, member.address, visible, queryClient]);

	useEffect(() => {
		if (data?.address && governanceModules[deployedModule]?.contract) {
			getCrossChainClaim(governanceModules[deployedModule]!.contract, data.address).then((data) => {
				if (data) {
					setVotingPower((state) => ({ ...state, l1: BigNumber.from(data.amount) }));
				}
			});
		}
	}, [data?.address, governanceModules, deployedModule]);

	const handleVote = async () => {
		setState('signing');
		setVisible(true);
		try {
			setContent(
				<>
					<h6 className="tg-title-h6">{t('modals.vote.cta', { council: 'Spartan' })}</h6>
					<h3 className="tg-title-h3">{member.ens || truncateAddress(member.address)}</h3>
				</>
			);
			const tx = await castVoteMutation.mutateAsync([member.address]);
			setTxHash(tx.hash);
		} catch (error) {
			console.error(error);
			setState('error');
		}
	};

	return (
		<BaseModal headline={t('modals.vote.headline', { council: capitalizeString(council) })}>
			<Avatar
				width={160}
				height={160}
				walletAddress={member.address}
				url={member.pfpThumbnailUrl}
			/>
			{member?.ens ? (
				<h4 className="tg-title-h4 text-white">{member.ens}</h4>
			) : (
				<h4 className="tg-title-h4 text-white">{truncateAddress(member.address)}</h4>
			)}
			<span className="text-gray-500 max-w-[500px] overflow-auto max-h-[200px] ">
				{member.about}
			</span>
			{!data?.connector ? (
				<div className="m-6">
					<ConnectButton />
				</div>
			) : (
				<Button
					onClick={() => handleVote()}
					size="lg"
					className="m-6"
					disabled={votingPower.l1.eq(0) && votingPower.l2.eq(0)}
				>
					{t('modals.vote.submit')}
				</Button>
			)}
			<Button
				size="lg"
				variant="outline"
				onClick={() => {
					setIsOpen(false);
					push('/profile/' + member.address);
				}}
			>
				{t('modals.vote.profile')}
			</Button>
		</BaseModal>
	);
}
