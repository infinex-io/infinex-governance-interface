import { ArrowLeftIcon, Flex, IconButton } from 'components/old-ui';
import { H1 } from 'components/Headlines/H1';
import Main from 'components/Main';
import { TextBold } from 'components/Text/bold';
import { DeployedModules } from 'containers/Modules/Modules';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useNomineesQuery from 'queries/nomination/useNomineesQuery';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { capitalizeString } from 'utils/capitalize';
import { parseQuery } from 'utils/parse';

export default function Vote() {
	const { query } = useRouter();
	const { t } = useTranslation();
	const { push } = useRouter();
	const activeCouncil = parseQuery(query?.council?.toString());
	const { data } = useNomineesQuery(activeCouncil.module);
	useEffect(() => console.log(data), [data]);
	return (
		<>
			<Head>
				<title>Synthetix | Governance V3</title>
			</Head>
			<Main>
				<Flex direction="column" alignItems="center">
					<StyledBackIconWrapper alignItems="center">
						<IconButton active onClick={() => push({ pathname: '/' })} rounded size="tiniest">
							<ArrowLeftIcon active />
						</IconButton>
						<TextBold color="lightBlue">{t('councils.back-btn')}</TextBold>
					</StyledBackIconWrapper>
					<H1>{t('vote.headline', { council: capitalizeString(activeCouncil.name) })}</H1>
					<Flex wrap>{data?.length && data.map((member) => <div key={member}>{member}</div>)}</Flex>
				</Flex>
			</Main>
		</>
	);
}

const StyledBackIconWrapper = styled(Flex)`
	position: absolute;
	top: 110px;
	left: ${({ theme }) => theme.spacings.biggest};
	> * {
		margin-right: ${({ theme }) => theme.spacings.medium};
	}
`;
