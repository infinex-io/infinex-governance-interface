import { H1 } from 'components/Headlines/H1';
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
	const { query, push } = useRouter();
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
				<H1>{t('vote.nominees', { council: capitalizeString(activeCouncil.name) })}</H1>
				<div className="flex flex-wrap">
					{usersDetailsQuery.data?.length &&
						usersDetailsQuery.data.map((member) => (
							<MemberCard
								key={member.about.concat(member.address)}
								member={member}
								isVoting
								onClick={(address: string) => {
									push({ pathname: '/profile', query: { address } });
								}}
							/>
						))}
				</div>
			</Main>
		</>
	);
}
