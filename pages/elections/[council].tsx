import Main from 'components/Main';
import Head from 'next/head';
import { useRouter } from 'next/router';
import CouncilMembersSection from 'sections/dashboard/CouncilMembers';

export default function CouncilMembers() {
	const { query } = useRouter();
	// TODO @DEV fetch council members depending on query
	return (
		<>
			<Head>Synthetix | {query}</Head>
			<Main>
				<CouncilMembersSection />
			</Main>
		</>
	);
}
