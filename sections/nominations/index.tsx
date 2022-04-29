import ElectedCouncil from 'components/ElectedCouncil';
import NominateSelfBanner from 'components/NominateSelfBanner';
import Election from './Election';

export default function NominationsLandingPage() {
	return (
		<>
			<NominateSelfBanner />
			<Election />
			<ElectedCouncil />
		</>
	);
}
