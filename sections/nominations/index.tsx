import ElectedCouncil from 'components/ElectedCouncil';
import NominateSelfBanner from 'components/Banners/NominateSelfBanner';
import Election from './Election';

export default function NominationsLandingPage() {
	return (
		<>
			<NominateSelfBanner hideButton />
			<Election />
			<ElectedCouncil />
		</>
	);
}
