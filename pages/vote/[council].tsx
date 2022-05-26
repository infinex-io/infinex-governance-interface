import Main from 'components/Main';
import MemberCard from 'components/MemberCard/Index';
import { useConnectorContext } from 'containers/Connector';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { GetUserDetails } from 'queries/boardroom/useUserDetailsQuery';
import useUsersDetailsQuery from 'queries/boardroom/useUsersDetailsQuery';
import useCurrentPeriod from 'queries/epochs/useCurrentPeriodQuery';
import useNomineesQuery from 'queries/nomination/useNomineesQuery';
import { useGetCurrentVoteStateQuery } from 'queries/voting/useGetCurrentVoteStateQuery';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { capitalizeString } from 'utils/capitalize';
import { parseQuery } from 'utils/parse';

export default function VoteCouncil() {
	const { query, push } = useRouter();
	const { t } = useTranslation();
	const activeCouncil = parseQuery(query?.council?.toString());
	const [userDetails, setUserDetails] = useState<GetUserDetails[]>([]);
	const [nominees, setNominees] = useState<string[]>([]);
	const [votedFor, setVotedFor] = useState<GetUserDetails | undefined>(undefined);
	const { walletAddress } = useConnectorContext();
	const { data: periodData } = useCurrentPeriod(activeCouncil.module);
	const { data: nomineesData } = useNomineesQuery(activeCouncil.module);
	const usersDetailsQuery = useUsersDetailsQuery(nominees);
	const voteStatusQuery = useGetCurrentVoteStateQuery(walletAddress || '');

	useEffect(() => {
		if (voteStatusQuery.data) setVotedFor(voteStatusQuery.data[activeCouncil.name].candidate);
	}, [voteStatusQuery.data, setVotedFor, activeCouncil.name]);

	useEffect(() => {
		if (periodData?.currentPeriod !== 'VOTING') push('/');
	}, [periodData, push]);

	useEffect(() => {
		if (usersDetailsQuery.data?.length) setUserDetails(() => [...usersDetailsQuery.data]);
	}, [nomineesData?.toString(), usersDetailsQuery.data]);

	useEffect(() => {
		if (nomineesData?.length) setNominees(() => [...nomineesData]);
	}, [nomineesData?.toString()]);

	return (
		<>
			<Head>
				<title>Synthetix | Governance V3</title>
			</Head>
			<Main>
				<h1 className="tg-title-h1 text-center">
					{t('vote.nominees', { council: capitalizeString(activeCouncil.name) })}
				</h1>
				<div className="flex flex-wrap justify-center space-x-4 space-y-4">
					{!!userDetails.length &&
						userDetails.map((member, index) => (
							<MemberCard
								key={member.address.concat(String(index).concat('voting'))}
								member={member}
								council={activeCouncil.name}
								deployedModule={activeCouncil.module}
								state="VOTING"
								votedFor={votedFor}
							/>
						))}
				</div>
			</Main>
		</>
	);
}
