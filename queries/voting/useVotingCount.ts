import { gql } from '@apollo/client';
import { DeployedModules, useModulesContext } from 'containers/Modules';
import { BigNumber } from 'ethers';
import client from 'gql/apollo-client';
import useEpochIndexQuery from 'queries/epochs/useEpochIndexQuery';
import { useQuery } from 'react-query';

export const useVotingCount = (moduleInstance: DeployedModules) => {
	const governanceModules = useModulesContext();
	const { data: epochIndex } = useEpochIndexQuery(moduleInstance);

	return useQuery<string>(
		['voteCountAll', moduleInstance],
		async () => {
			const contractAddress = governanceModules[moduleInstance]?.contract?.address?.toLowerCase();

			const { data } = await client.query({
				query: gql`
					query VoteResults {
						voteResults(
							where: { contract: "${contractAddress}", epochIndex: "${epochIndex}" }
						) {
							voteCount
						}
					}
				`,
			});

			return data.voteResults
				.reduce((cur: BigNumber, prev: any) => cur.add(prev.voteCount), BigNumber.from(0))
				.toString();
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null && epochIndex !== undefined,
			staleTime: 900000,
		}
	);
};
