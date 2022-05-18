import { ArrowLeftIcon, IconButton } from 'components/old-ui';
import { H1 } from 'components/Headlines/H1';
import Main from 'components/Main';
import { TextBold } from 'components/Text/bold';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useNomineesQuery from 'queries/nomination/useNomineesQuery';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { capitalizeString } from 'utils/capitalize';
import { parseQuery } from 'utils/parse';
import VoteBanner from 'components/Banners/VoteBanner';
import MemberCard from 'components/MemberCard/Index';
import useUsersDetailsQuery from 'queries/boardroom/useUsersDetailsQuery';

export default function Vote() {
	const { query } = useRouter();
	const { t } = useTranslation();
	const { push } = useRouter();
	const activeCouncil = parseQuery(query?.council?.toString());
	const { data } = useNomineesQuery(activeCouncil.module);
	const usersDetailsQuery = useUsersDetailsQuery(data || []);

	return (
		<>
			<Head>
				<title>Synthetix | Governance V3</title>
			</Head>
			<Main>
				<VoteBanner />
				<div className="flex flex-col items-center">
					<div className="flex items-center absolute top-1/4 left-1/4">
						<IconButton active onClick={() => push({ pathname: '/' })} rounded size="tiniest">
							<ArrowLeftIcon active />
						</IconButton>
						<TextBold color="lightBlue">{t('councils.back-btn')}</TextBold>
					</div>
					<H1>{t('vote.headline', { council: capitalizeString(activeCouncil.name) })}</H1>
					<div className="flex flex-wrap">
						{usersDetailsQuery.data?.length &&
							usersDetailsQuery.data.map((member) => (
								<MemberCard key={member.about.concat(member.address)} member={member} isVoting />
							))}
					</div>
				</div>
			</Main>
		</>
	);
}
