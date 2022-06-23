import clsx from 'clsx';
import { CouncilBadge } from 'components/CouncilBadge';
import { ArrowLinkOffIcon } from 'components/old-ui';
import { DeployedModules } from 'containers/Modules';
import { BigNumber, utils } from 'ethers';
import Link from 'next/link';
import useUserDetailsQuery from 'queries/boardroom/useUserDetailsQuery';
import { BallotVotes } from 'queries/voting/usePreEvaluationVotingPowerQuery';
import { useTranslation } from 'react-i18next';
import { currency } from 'utils/currency';
import { calcPercentage } from 'utils/helpers';
import { truncateAddress } from 'utils/truncate-address';

interface PreEvaluationSectionRowProps {
	walletAddress: string;
	prevEval: BallotVotes;
	isActive?: boolean;
	totalVotingPowers: BigNumber | undefined;
}

export function PreEvaluationSectionRowMobile({
	walletAddress,
	prevEval,
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
					'border-l-primary': isActive && prevEval.council === DeployedModules.SPARTAN_COUNCIL,
					'border-l-green': isActive && prevEval.council === DeployedModules.GRANTS_COUNCIL,
					'border-l-orange': isActive && prevEval.council === DeployedModules.AMBASSADOR_COUNCIL,
					'border-l-yellow': isActive && prevEval.council === DeployedModules.TREASURY_COUNCIL,
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
							<CouncilBadge council={prevEval.council} />
						</div>
					</>
				)}
				<h6 className="tg-title-h6 text-gray-500">{t('vote.pre-eval.list.vote')}</h6>
				<h5 className="tg-title-h5">{prevEval.voters.length}</h5>
				<h6 className="tg-title-h6 text-gray-500">{t('vote.pre-eval.table.received')}</h6>
				<h5 className="tg-title-h5 truncate ">
					{currency(utils.formatUnits(prevEval.totalVotingPower, 'wei'))}
				</h5>
				<h6 className="tg-title-h6 text-gray-500">{t('vote.pre-eval.list.power')}</h6>
				<h5 className="tg-title-h5">
					{totalVotingPowers && calcPercentage(prevEval.totalVotingPower, totalVotingPowers)}%
				</h5>
			</div>
			<div className="absolute right-3 top-3">
				<Link
					href={`https://optimistic.etherscan.io/address/${userDetailsQuery?.data?.address}`}
					passHref
				>
					<a target="_blank" rel="noreferrer">
						<ArrowLinkOffIcon active />
					</a>
				</Link>
			</div>
		</div>
	);
}
