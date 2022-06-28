import { Icon, IconButton } from '@synthetixio/ui';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

export default function BackButton() {
	const { push } = useRouter();
	const { t } = useTranslation();
	return (
		<div className="md:flex items-center absolute top-[50%] left-1 translate-y-[-50%] hidden">
			<IconButton
				onClick={() => push('/')}
				rounded
				size="sm"
				className="bg-black bg-gradient-to-l from-gray-800"
			>
				<Icon name="Left" className="text-primary" />
			</IconButton>
			<span className="tg-content text-primary ml-2">{t('councils.back-btn')}</span>
		</div>
	);
}
