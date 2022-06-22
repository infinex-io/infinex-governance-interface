import clsx from 'clsx';
import { CouncilBadge } from 'components/CouncilBadge';
import { ArrowLinkOffIcon, Tabs } from 'components/old-ui';
import { DeployedModules } from 'containers/Modules';
import { BigNumber, utils } from 'ethers';
import Link from 'next/link';
import useUserDetailsQuery from 'queries/boardroom/useUserDetailsQuery';
import { BallotVotes } from 'queries/voting/usePreEvaluationVotingPowerQuery';
import { currency } from 'utils/currency';
import { calcPercentage } from 'utils/helpers';
import { truncateAddress } from 'utils/truncate-address';

interface PreEvaluationSectionRowProps {
	walletAddress: string;
	prevEval: BallotVotes;
	isActive?: boolean;
	totalVotingPowers: BigNumber | undefined;
}

export function PreEvaluationSectionRow({
	walletAddress,
	prevEval,
	isActive,
	totalVotingPowers,
}: PreEvaluationSectionRowProps) {
	const userDetailsQuery = useUserDetailsQuery(walletAddress);

	const recievedVotingPower = prevEval.votingPowers.reduce(
		(prev, cur) => prev.add(cur),
		BigNumber.from(0)
	);

	return (
		<tr>
			<th
				className={clsx('text-left p-6 flex items-center', {
					'border-l': isActive,
					'border-l-primary': isActive && prevEval.council === DeployedModules.SPARTAN_COUNCIL,
					'border-l-green': isActive && prevEval.council === DeployedModules.GRANTS_COUNCIL,
					'border-l-orange': isActive && prevEval.council === DeployedModules.AMBASSADOR_COUNCIL,
					'border-l-yellow': isActive && prevEval.council === DeployedModules.TREASURY_COUNCIL,
				})}
			>
				{userDetailsQuery?.data?.username || truncateAddress(userDetailsQuery?.data?.address || '')}
				{isActive && <CouncilBadge className="ml-4" council={prevEval.council} />}
			</th>
			<th className="p-6">{prevEval.voters.length}</th>
			<th className="p-6">
				{totalVotingPowers && calcPercentage(prevEval.totalVotingPower, totalVotingPowers)}%
			</th>
			<th className="p-6">{currency(utils.formatUnits(recievedVotingPower, 'wei'))}</th>
			<th className="p-6 flex justify-end">
				<Link
					href={`https://optimistic.etherscan.io/address/${userDetailsQuery?.data?.address}`}
					passHref
				>
					<a target="_blank" rel="noreferrer">
						<ArrowLinkOffIcon active />
					</a>
				</Link>
			</th>
		</tr>
	);
}
