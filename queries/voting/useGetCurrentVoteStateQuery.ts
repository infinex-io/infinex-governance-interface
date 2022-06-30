import { DeployedModules, useModulesContext } from 'containers/Modules';
import { useQuery } from 'react-query';
import client from 'gql/apollo-client';
import { gql } from '@apollo/client';
import { Contract } from 'ethers';
import { moduleAddresses } from 'containers/Modules/Modules';
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
	const contractAddress = moduleAddresses[moduleInstance];
	const epochIndex = String((await contract.getEpochIndex()) || '0');

	const { data } = await client.query({
		query: gql`
				query Votes {
					votes(
						where: { epochIndex: "${epochIndex}", contract: "${contractAddress.toLowerCase()}", voter: "${voter.toLowerCase()}" }
					) {
						id
						voter
						ballotId
						epochIndex
						voter
					}
				}
			`,
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
			const [spartanVoteDetails, grantsVoteDetails, ambassadorVoteDetails, treasuryVoteDetails] =
				await Promise.all([
					getVoteDetails(
						governanceModules[DeployedModules.SPARTAN_COUNCIL]?.contract,
						DeployedModules.SPARTAN_COUNCIL,
						walletAddress
					),
					getVoteDetails(
						governanceModules[DeployedModules.GRANTS_COUNCIL]?.contract,
						DeployedModules.GRANTS_COUNCIL,
						walletAddress
					),
					getVoteDetails(
						governanceModules[DeployedModules.AMBASSADOR_COUNCIL]?.contract,
						DeployedModules.AMBASSADOR_COUNCIL,
						walletAddress
					),
					getVoteDetails(
						governanceModules[DeployedModules.TREASURY_COUNCIL]?.contract,
						DeployedModules.TREASURY_COUNCIL,
						walletAddress
					),
				]);

			return {
				spartan: spartanVoteDetails,
				grants: grantsVoteDetails,
				ambassador: ambassadorVoteDetails,
				treasury: treasuryVoteDetails,
			};
		},
		{
			enabled: governanceModules !== null && !!walletAddress,
			cacheTime: 900000,
		}
	);
}
