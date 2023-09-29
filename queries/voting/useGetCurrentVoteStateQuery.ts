import { DeployedModules, useModulesContext } from 'containers/Modules';
import { useQuery } from 'react-query';
import client from 'gql/apollo-client';
import { gql } from '@apollo/client';
import { Contract } from 'ethers';
import { hexStringBN } from 'utils/hexString';

async function getVoteDetails(
	contract: Contract | undefined,
	moduleInstance: DeployedModules,
	voter: string
) {
	if (!contract || !moduleInstance)
		return {
			voted: false,
			ballotId: '',
		};
	const contractAddress = contract.address.toLowerCase();
	const parsedVoter = voter.toLowerCase();
	const epochIndex = String((await contract.getEpochIndex()) || '0');

	const { data } = await client.query({
		query: gql`
				query Votes {
					votes(
						where: { epochIndex: "${epochIndex}", contract: "${contractAddress}", voter: "${parsedVoter}" }
					) {
						id
						voter
						ballotId
						epochIndex
						voter
					}
				}
			`,
		fetchPolicy: 'no-cache',
	});

	const ballotId = data.votes[0] ? data.votes[0].ballotId : '';
	const candidateAddress = ballotId
		? await contract.getBallotCandidatesInEpoch(ballotId, hexStringBN(epochIndex))
		: undefined;

	return {
		voted: !!ballotId,
		ballotId,
		candidateAddress,
	};
}

export function useGetCurrentVoteStateQuery(walletAddress: string) {
	const governanceModules = useModulesContext();
	return useQuery(
		['getCurrentVoteStateQuery', walletAddress],
		async () => {
			const [tradeVoteDetails, ecosystemVoteDetails, coreContributorVoteDetails, treasuryVoteDetails] =
				await Promise.all([
					getVoteDetails(
						governanceModules[DeployedModules.TRADE_COUNCIL]?.contract,
						DeployedModules.TRADE_COUNCIL,
						walletAddress
					),
					getVoteDetails(
						governanceModules[DeployedModules.CORE_CONTRIBUTORS_COUNCIL]?.contract,
						DeployedModules.CORE_CONTRIBUTORS_COUNCIL,
						walletAddress
					),
					getVoteDetails(
						governanceModules[DeployedModules.ECOSYSTEM_COUNCIL]?.contract,
						DeployedModules.ECOSYSTEM_COUNCIL,
						walletAddress
					),
					getVoteDetails(
						governanceModules[DeployedModules.TREASURY_COUNCIL]?.contract,
						DeployedModules.TREASURY_COUNCIL,
						walletAddress
					),
				]);

			return {
				trade: tradeVoteDetails,
				ecosystem: ecosystemVoteDetails,
				coreContributor: coreContributorVoteDetails,
				treasury: treasuryVoteDetails,
			};
		},
		{
			enabled: governanceModules !== null && !!walletAddress,
			cacheTime: 900000,
		}
	);
}
