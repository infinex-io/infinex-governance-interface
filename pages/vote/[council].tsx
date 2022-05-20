import Main from 'components/Main';
import MemberCard from 'components/MemberCard/Index';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { GetUserDetails } from 'queries/boardroom/useUserDetailsQuery';
import useUsersDetailsQuery from 'queries/boardroom/useUsersDetailsQuery';
import useNomineesQuery from 'queries/nomination/useNomineesQuery';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { capitalizeString } from 'utils/capitalize';
import { parseQuery } from 'utils/parse';

export default function VoteCouncil() {
	const { query } = useRouter();
	const { t } = useTranslation();
	const activeCouncil = parseQuery(query?.council?.toString());
	const [userDetails, setUserDetails] = useState<GetUserDetails[]>([]);
	const [nominees, setNominees] = useState<string[]>([]);
	const { data: nomineesData } = useNomineesQuery(activeCouncil.module);
	const usersDetailsQuery = useUsersDetailsQuery(nominees);

	useEffect(() => {
		if (usersDetailsQuery.data) setUserDetails((state) => [...state, ...usersDetailsQuery.data]);
	}, [nomineesData?.toString(), usersDetailsQuery.data]);

	useEffect(() => {
		if (nomineesData) setNominees((state) => [...state, ...nomineesData]);
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
							/>
						))}
				</div>
			</Main>
		</>
	);
}
