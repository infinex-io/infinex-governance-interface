import Main from 'components/Main';
import MemberCard from 'components/MemberCard/Index';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useUsersDetailsQuery from 'queries/boardroom/useUsersDetailsQuery';
import useNomineesQuery from 'queries/nomination/useNomineesQuery';
import { useTranslation } from 'react-i18next';
import { capitalizeString } from 'utils/capitalize';
import { parseQuery } from 'utils/parse';

export default function VoteCouncil() {
	const { query } = useRouter();
	const { t } = useTranslation();
	const activeCouncil = parseQuery(query?.council?.toString());
	const { data } = useNomineesQuery(activeCouncil.module);
	const usersDetailsQuery = useUsersDetailsQuery(data || []);

	return (
		<>
			<Head>
				<title>Synthetix | Governance V3</title>
			</Head>
			<Main>
				<h1 className="tg-title-h1 text-center">
					{t('vote.nominees', { council: capitalizeString(activeCouncil.name) })}
				</h1>
				<div className="flex flex-wrap justify-center">
					{usersDetailsQuery.data?.length &&
						usersDetailsQuery.data.map((member) => (
							<MemberCard
								key={member.about.concat(member.address)}
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
