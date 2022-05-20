import { Button } from '@synthetixio/ui';
import { DeployedModules } from 'containers/Modules';
import useWithdrawVoteMutation from 'mutations/voting/useWithdrawVoteMutation';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { capitalizeString } from 'utils/capitalize';
import { parseQuery } from 'utils/parse';
import { truncateAddress } from 'utils/truncate-address';

interface WithdrawVoteProps {
	address: string;
}

export default function WithdrawVote({ address }: WithdrawVoteProps) {
	const { t } = useTranslation();
	const { query, push } = useRouter();
	const withdrawVoteMutation = useWithdrawVoteMutation(
		parseQuery(query?.council?.toString()).module
	);
	const handleWithdraw = async () => {
		const tx = await withdrawVoteMutation.mutateAsync();
		if (tx) {
			push({ pathname: '/vote' });
		}
	};
	return (
		<div className="p-1 min-h-full">
			<div className="darker-60 min-w-full h-full flex flex-col items-center justify-center">
				<h1 className="tg-title-h1">{t('modals.withdraw-vote.headline')}</h1>
				<div className="bg-black max-w-[300px] p-8">
					<h6 className="tg-title-h6">
						{t('modals.withdraw-vote.voted-for', {
							council: capitalizeString(query?.council?.toString()),
						})}
					</h6>
					<h3 className="tg-title-h3">{truncateAddress(address)}</h3>
				</div>
				<Button size="lg" className="m-10" onClick={handleWithdraw}>
					{t('modals.withdraw-vote.uncast-vote')}
				</Button>
			</div>
		</div>
	);
}
