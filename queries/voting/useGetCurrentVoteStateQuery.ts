import { useModulesContext } from 'containers/Modules';
import { useQuery } from 'react-query';
import { hexStringBN } from 'utils/hexString';
import { voteHistory } from 'queries/eventHistory/useVoteHistoryQuery';
import { GET_USER_DETAILS_API_URL } from 'constants/boardroom';
import { GetUserDetails } from 'queries/boardroom/useUserDetailsQuery';

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
					spartanEpochIndex.toString() || null
				),
				voteHistory(
					governanceModules['grants council']!.contract,
					walletAddress,
					null,
					grantsEpochIndex.toString() || null
				),
				voteHistory(
					governanceModules['ambassador council']!.contract,
					walletAddress,
					null,
					ambassadorEpochIndex.toString() || null
				),
				voteHistory(
					governanceModules['treasury council']!.contract,
					walletAddress,
					null,
					treasuryEpochIndex.toString() || null
				),
			]);

			const [spartanCandidate, grantsCandidate, ambassadorCandidate, treasuryCandidate] =
				await Promise.all([
					voteHistorySpartan.length
						? governanceModules['spartan council']!.contract.getBallotCandidatesInEpoch(
								voteHistorySpartan[voteHistorySpartan.length - 1].ballotId,
								hexStringBN(spartanEpochIndex.toString())
						  )
						: false,
					voteHistoryGrants.length
						? governanceModules['grants council']!.contract.getBallotCandidatesInEpoch(
								voteHistoryGrants[voteHistoryGrants.length - 1].ballotId,
								hexStringBN(grantsEpochIndex.toString())
						  )
						: false,
					voteHistoryAmbassador.length
						? governanceModules['ambassador council']!.contract.getBallotCandidatesInEpoch(
								voteHistoryAmbassador[voteHistoryAmbassador.length - 1].ballotId,
								hexStringBN(ambassadorEpochIndex.toString())
						  )
						: false,
					voteHistoryTreasury.length
						? governanceModules['treasury council']!.contract.getBallotCandidatesInEpoch(
								voteHistoryTreasury[voteHistoryTreasury.length - 1].ballotId,
								hexStringBN(treasuryEpochIndex.toString())
						  )
						: false,
				]);

			const spartanCandidateInfoResponse =
				spartanCandidate &&
				fetch(GET_USER_DETAILS_API_URL(spartanCandidate), {
					method: 'POST',
				});
			const grantsCandidateInfoResponse =
				grantsCandidate &&
				fetch(GET_USER_DETAILS_API_URL(grantsCandidate), {
					method: 'POST',
				});

			const ambassadorCandidateInfoResponse =
				ambassadorCandidate &&
				fetch(GET_USER_DETAILS_API_URL(ambassadorCandidate), {
					method: 'POST',
				});

			const treasuryCandidateInfoResponse =
				treasuryCandidate &&
				fetch(GET_USER_DETAILS_API_URL(treasuryCandidate), {
					method: 'POST',
				});

			const responses = await Promise.all([
				spartanCandidateInfoResponse,
				grantsCandidateInfoResponse,
				ambassadorCandidateInfoResponse,
				treasuryCandidateInfoResponse,
			]);
			const results = await Promise.all(
				responses.map((response) => {
					if (response) return response.json();
					return;
				})
			);
			const result = results.map((r) => {
				if (r) return r.data;
				return;
			});

			return {
				spartan: {
					voted: !!hasVotedSpartan,
					candidate: result[0] as GetUserDetails,
				},
				grants: {
					voted: !!hasVotedGrants,
					candidate: result[1] as GetUserDetails,
				},
				ambassador: {
					voted: !!hasVotedAmbassador,
					candidate: result[2] as GetUserDetails,
				},
				treasury: {
					voted: !!hasVotedTreasury.data,
					candidate: result[3] as GetUserDetails,
				},
			};
		},
		{
			enabled: governanceModules !== null && walletAddress !== null,
			cacheTime: 900000,
		}
	);
}
