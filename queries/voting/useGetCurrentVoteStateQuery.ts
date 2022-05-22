import { useModulesContext } from 'containers/Modules';
import { useQuery } from 'react-query';
import { hexStringBN } from 'utils/hexString';
import { voteHistory } from 'queries/eventHistory/useVoteHistoryQuery';

export function useGetCurrentVoteStateQuery(walletAddress: string) {
	const governanceModules = useModulesContext();
	return useQuery(
		['getCurrentVoteStateQuery', walletAddress],
		async () => {
			const [spartanEpochIndex, grantsEpochIndex, ambassadorEpochIndex, treasuryEpochIndex] =
				await Promise.all([
					governanceModules['spartan council']?.contract.getEpochIndex(),
					governanceModules['grants council']?.contract.getEpochIndex(),
					governanceModules['ambassador council']?.contract.getEpochIndex(),
					governanceModules['treasury council']?.contract.getEpochIndex(),
				]);

			const [
				hasVotedSpartan,
				hasVotedGrants,
				hasVotedAmbassador,
				hasVotedTreasury,
				voteHistorySpartan,
				voteHistoryGrants,
				voteHistoryAmbassador,
				voteHistoryTreasury,
			] = await Promise.all([
				governanceModules['spartan council']?.contract.hasVotedInEpoch(
					walletAddress,
					hexStringBN(String(spartanEpochIndex))
				),
				governanceModules['grants council']?.contract.hasVotedInEpoch(
					walletAddress,
					hexStringBN(String(grantsEpochIndex))
				),
				governanceModules['ambassador council']?.contract.hasVotedInEpoch(
					walletAddress,
					hexStringBN(String(ambassadorEpochIndex))
				),
				governanceModules['treasury council']?.contract.hasVotedInEpoch(
					walletAddress,
					hexStringBN(String(treasuryEpochIndex))
				),
				voteHistory(
					governanceModules['spartan council']!.contract,
					walletAddress,
					null,
					String(spartanEpochIndex) || null
				),
				voteHistory(
					governanceModules['grants council']!.contract,
					walletAddress,
					null,
					String(grantsEpochIndex) || null
				),
				voteHistory(
					governanceModules['ambassador council']!.contract,
					walletAddress,
					null,
					String(ambassadorEpochIndex) || null
				),
				voteHistory(
					governanceModules['treasury council']!.contract,
					walletAddress,
					null,
					String(treasuryEpochIndex) || null
				),
			]);

			const [spartanCandidate, grantsCandidate, ambassadorCandidate, treasuryCandidate] =
				await Promise.all([
					voteHistorySpartan.length
						? governanceModules['spartan council']!.contract.getBallotCandidatesInEpoch(
								voteHistorySpartan[voteHistorySpartan.length - 1].ballotId,
								hexStringBN(String(spartanEpochIndex))
						  )
						: false,
					voteHistoryGrants.length
						? governanceModules['spartan council']!.contract.getBallotCandidatesInEpoch(
								voteHistoryGrants[voteHistoryGrants.length - 1].ballotId,
								hexStringBN(String(grantsEpochIndex))
						  )
						: false,
					voteHistoryAmbassador.length
						? governanceModules['spartan council']!.contract.getBallotCandidatesInEpoch(
								voteHistoryAmbassador[voteHistoryAmbassador.length - 1].ballotId,
								hexStringBN(String(ambassadorEpochIndex))
						  )
						: false,
					voteHistoryTreasury.length
						? governanceModules['spartan council']!.contract.getBallotCandidatesInEpoch(
								voteHistoryTreasury[voteHistoryTreasury.length - 1].ballotId,
								hexStringBN(String(treasuryEpochIndex))
						  )
						: false,
				]);

			return {
				spartan: {
					voted: !!hasVotedSpartan,
					candidate: spartanCandidate?.length
						? (spartanCandidate[spartanCandidate?.length - 1] as string)
						: '',
				},
				grants: {
					voted: !!hasVotedGrants,
					candidate: grantsCandidate?.length
						? (grantsCandidate[grantsCandidate?.length - 1] as string)
						: '',
				},
				ambassador: {
					voted: !!hasVotedAmbassador,
					candidate: ambassadorCandidate?.length
						? (ambassadorCandidate[ambassadorCandidate?.length - 1] as string)
						: '',
				},
				treasury: {
					voted: !!hasVotedTreasury.data,
					candidate: treasuryCandidate.data?.length
						? (treasuryCandidate.data[treasuryCandidate.data?.length - 1] as string)
						: '',
				},
			};
		},
		{
			enabled: governanceModules !== null && walletAddress !== null,
			// 15 mins
			cacheTime: 900000,
		}
	);
}
