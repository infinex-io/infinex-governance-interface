import { Icon } from '@synthetixio/ui';
import clsx from 'clsx';
import { CouncilBadge } from 'components/CouncilBadge';
import { DeployedModules } from 'containers/Modules';
import { BigNumber, utils } from 'ethers';
import Link from 'next/link';
import useUserDetailsQuery from 'queries/boardroom/useUserDetailsQuery';
import { VoteResult } from 'queries/voting/useVotingResult';
import { currency } from 'utils/currency';
import { calcPercentage } from 'utils/helpers';
import { truncateAddress } from 'utils/truncate-address';

interface PreEvaluationSectionRowProps {
	walletAddress: string;
	voteResult: VoteResult;
	isActive?: boolean;
	totalVotingPowers: BigNumber | undefined;
}

export function PreEvaluationSectionRow({
	walletAddress,
	voteResult,
	isActive,
	totalVotingPowers,
}: PreEvaluationSectionRowProps) {
	const userDetailsQuery = useUserDetailsQuery(walletAddress);

	return (
		<tr>
			<th
				className={clsx('text-left p-6 flex items-center', {
					'border-l': isActive,
					'border-l-primary': isActive && voteResult.council === DeployedModules.SPARTAN_COUNCIL,
					'border-l-green': isActive && voteResult.council === DeployedModules.GRANTS_COUNCIL,
					'border-l-orange': isActive && voteResult.council === DeployedModules.AMBASSADOR_COUNCIL,
					'border-l-yellow': isActive && voteResult.council === DeployedModules.TREASURY_COUNCIL,
				})}
			>
				{userDetailsQuery?.data?.username || truncateAddress(userDetailsQuery?.data?.address || '')}
				{isActive && <CouncilBadge className="ml-4" council={voteResult.council} />}
			</th>
			<th className="p-6">{voteResult.voteCount}</th>
			<th className="p-6">
				{totalVotingPowers && calcPercentage(voteResult.totalVotePower, totalVotingPowers)}%
			</th>
			<th className="p-6">
				{currency(
					utils.formatUnits(
						voteResult.totalVotePower,
						voteResult.council === DeployedModules.TREASURY_COUNCIL ? 'ether' : 'wei'
					)
				)}
			</th>
			<th className="p-6 flex justify-end">
				<Link
					href={`https://optimistic.etherscan.io/address/${userDetailsQuery?.data?.address}`}
					passHref
				>
					<a target="_blank" rel="noreferrer">
						<Icon name="Link-off" className="text-primary" />
					</a>
				</Link>
			</th>
		</tr>
	);
}
