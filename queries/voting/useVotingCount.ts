import { gql } from '@apollo/client';
import { DeployedModules, useModulesContext } from 'containers/Modules';
import { BigNumber } from 'ethers';
import client from 'gql/apollo-client';
import { useCurrentPeriod } from 'queries/epochs/useCurrentPeriodQuery';
import useEpochIndexQuery from 'queries/epochs/useEpochIndexQuery';
import { useQuery } from 'react-query';

export const useVotingCount = (
	moduleInstance: DeployedModules,
	useCountFromPreviousPeriod: boolean = false
) => {
	const governanceModules = useModulesContext();
	const { data: epochIndex } = useEpochIndexQuery(moduleInstance);
	const { data: currentPeriodData } = useCurrentPeriod(moduleInstance);
	return useQuery<string>(
		['voteCountAll', moduleInstance],
		async () => {
			const contractAddress = governanceModules[moduleInstance]?.contract?.address?.toLowerCase();
			const parsedEpochIndex =
				useCountFromPreviousPeriod &&
				currentPeriodData?.currentPeriod === 'ADMINISTRATION' &&
				epochIndex
					? epochIndex - 1
					: epochIndex;
			const { data } = await client.query({
				query: gql`
					query VoteResults {
						voteResults(
							where: { contract: "${contractAddress}", epochIndex: "${parsedEpochIndex}" }
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
