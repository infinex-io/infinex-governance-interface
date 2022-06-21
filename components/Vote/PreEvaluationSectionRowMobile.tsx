import { wei } from '@synthetixio/wei';
import clsx from 'clsx';
import { CouncilBadge } from 'components/CouncilBadge';
import { ArrowLinkOffIcon } from 'components/old-ui';
import { DeployedModules } from 'containers/Modules';
import { BigNumber, utils } from 'ethers';
import Link from 'next/link';
import useUserDetailsQuery from 'queries/boardroom/useUserDetailsQuery';
import { BallotVotes } from 'queries/voting/usePreEvaluationVotingPowerQuery';
import { useTranslation } from 'react-i18next';
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
	const calcPercentage = (a: BigNumber, b: BigNumber) => {
		return ((wei(a).toNumber() / wei(b).toNumber()) * 100).toFixed(2);
	};

	return (
		<div
			className={clsx(
				'bg-dark-blue border-gray-700 border-[1px] rounded w-full flex relative p-4',
				{
					'border-l-[1px]': isActive,
					'border-l-primary': isActive && prevEval.council === DeployedModules.SPARTAN_COUNCIL,
					'border-l-green': isActive && prevEval.council === DeployedModules.GRANTS_COUNCIL,
					'border-l-orange': isActive && prevEval.council === DeployedModules.AMBASSADOR_COUNCIL,
					'border-l-yellow': isActive && prevEval.council === DeployedModules.TREASURY_COUNCIL,
				}
			)}
		>
			<div className="flex flex-col gap-2 mr-2">
				<h6 className="tg-title-h6 text-gray-500">{t('vote.pre-eval.list.name')}</h6>
				{isActive && (
					<h6 className="tg-title-h6 text-gray-500">{t('vote.pre-eval.list.council')}</h6>
				)}
				<h6 className="tg-title-h6 text-gray-500">{t('vote.pre-eval.list.vote')}</h6>
				<h6 className="tg-title-h6 text-gray-500">{t('vote.pre-eval.table.received')}</h6>
				<h6 className="tg-title-h6 text-gray-500">{t('vote.pre-eval.list.power')}</h6>
			</div>
			<div className="flex flex-col gap-1">
				<h5 className="tg-title-h5">
					{userDetailsQuery?.data?.username ||
						truncateAddress(userDetailsQuery?.data?.address || '')}
				</h5>
				{isActive && (
					<div>
						<CouncilBadge council={prevEval.council} />
					</div>
				)}
				<h5 className="tg-title-h5">{prevEval.voters.length}</h5>
				<h5 className="tg-title-h5 truncate ">
					{utils.formatUnits(
						prevEval.votingPowers.reduce((prev, cur) => prev.add(cur), BigNumber.from(0)),
						'wei'
					)}
				</h5>
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
