import { H1 } from 'components/Headlines/H1';
import { useTranslation } from 'react-i18next';

export default function VoteSection() {
	const { t } = useTranslation();
	return (
		<div className="flex flex-column items-center">
			<H1>{t('vote.headline')}</H1>
		</div>
	);
}
