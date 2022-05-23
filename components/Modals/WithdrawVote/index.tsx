import { Button, IconButton } from '@synthetixio/ui';
import { CloseIcon } from 'components/old-ui';
import { useModalContext } from 'containers/Modal';
import { DeployedModules } from 'containers/Modules';
import useWithdrawVoteMutation from 'mutations/voting/useWithdrawVoteMutation';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { truncateAddress } from 'utils/truncate-address';

interface WithdrawVoteProps {
	address: string;
	council: string;
	deployedModule: DeployedModules;
	ens?: string;
}

export default function WithdrawVote({ address, council, deployedModule, ens }: WithdrawVoteProps) {
	const { t } = useTranslation();
	const { push } = useRouter();
	const { setIsOpen } = useModalContext();
	const withdrawVoteMutation = useWithdrawVoteMutation(deployedModule);
	const handleWithdraw = async () => {
		const tx = await withdrawVoteMutation.mutateAsync();
		if (tx) {
			push({ pathname: '/vote' });
		}
	};
	return (
		<div className="p-1 min-h-full bg-purple relative rounded">
			<IconButton className="absolute right-2 top-2" rounded onClick={() => setIsOpen(false)}>
				<CloseIcon active />
			</IconButton>
			<div className="darker-60 min-w-full min-h-full  flex flex-col items-center justify-center rounded">
				<h1 className="tg-title-h1 text-white">{t('modals.withdraw-vote.headline')}</h1>
				<div className="bg-black max-w-[350px] p-8 text-white">
					<h6 className="tg-title-h6 text-center">
						{t('modals.withdraw-vote.voted-for', {
							council,
						})}
					</h6>
					<h3 className="tg-title-h3 text-center">{ens ? ens : truncateAddress(address)}</h3>
				</div>
				<Button size="lg" className="m-10" onClick={handleWithdraw}>
					{t('modals.withdraw-vote.uncast-vote')}
				</Button>
			</div>
		</div>
	);
}
