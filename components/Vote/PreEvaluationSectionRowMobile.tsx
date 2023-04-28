import { Icon } from '@synthetixio/ui';
import clsx from 'clsx';
import { CouncilBadge } from 'components/CouncilBadge';
import { DeployedModules } from 'containers/Modules';
import { BigNumber, utils } from 'ethers';
import Link from 'next/link';
import useUserDetailsQuery from 'queries/boardroom/useUserDetailsQuery';
import { VoteResult } from 'queries/voting/useVotingResult';
import { useTranslation } from 'react-i18next';
import { currency } from 'utils/currency';
import { calcPercentage } from 'utils/helpers';
import { truncateAddress } from 'utils/truncate-address';

interface PreEvaluationSectionRowProps {
	walletAddress: string;
	voteResult: VoteResult;
	isActive?: boolean;
	totalVotingPowers: BigNumber | undefined;
}

export function PreEvaluationSectionRowMobile({
	walletAddress,
	voteResult,
	isActive,
	totalVotingPowers,
}: PreEvaluationSectionRowProps) {
	const { t } = useTranslation();
	const userDetailsQuery = useUserDetailsQuery(walletAddress);

	return (
		<div
			className={clsx(
				'bg-dark-blue border-gray-700 first:rounded-t last:rounded-b border border-b-0 last:border-b w-full flex relative p-4',
				{
					'border-l': isActive,
					'border-l-primary': isActive && voteResult.council === DeployedModules.SPARTAN_COUNCIL,
					'border-l-green': isActive && voteResult.council === DeployedModules.GRANTS_COUNCIL,
					'border-l-orange': isActive && voteResult.council === DeployedModules.AMBASSADOR_COUNCIL,
					'border-l-yellow': isActive && voteResult.council === DeployedModules.TREASURY_COUNCIL,
				}
			)}
		>
			<div className="grid grid-cols-2 gap-2">
				<h6 className="tg-title-h6 text-gray-500">{t('vote.pre-eval.list.name')}</h6>
				<h5 className="tg-title-h5">
					{userDetailsQuery?.data?.username ||
						truncateAddress(userDetailsQuery?.data?.address || '')}
				</h5>
				{isActive && (
					<>
						<h6 className="tg-title-h6 text-gray-500">{t('vote.pre-eval.list.council')}</h6>
						<div className="flex items-center">
							<CouncilBadge council={voteResult.council} />
						</div>
					</>
				)}
				<h6 className="tg-title-h6 text-gray-500">{t('vote.pre-eval.list.vote')}</h6>
				<h5 className="tg-title-h5">{voteResult.voteCount}</h5>
				<h6 className="tg-title-h6 text-gray-500">
					{t('vote.pre-eval.table.received', {
						units: voteResult.council === DeployedModules.TREASURY_COUNCIL ? 'Ether' : 'Gwei',
					})}
				</h6>
				<h5 className="tg-title-h5 truncate">
					{currency(
						utils.formatUnits(
							voteResult.totalVotePower,
							voteResult.council === DeployedModules.TREASURY_COUNCIL ? 'ether' : 'gwei'
						)
					)}
				</h5>
				<h6 className="tg-title-h6 text-gray-500">{t('vote.pre-eval.list.power')}</h6>
				<h5 className="tg-title-h5">
					{totalVotingPowers && calcPercentage(voteResult.totalVotePower, totalVotingPowers)}%
				</h5>
			</div>
			<div className="absolute right-3 top-3">
				<Link
					href={`https://optimistic.etherscan.io/address/${userDetailsQuery?.data?.address}`}
					passHref
					target="_blank"
					rel="noreferrer"
				>
					<Icon name="Link-off" className="text-primary" />
				</Link>
			</div>
		</div>
	);
}
