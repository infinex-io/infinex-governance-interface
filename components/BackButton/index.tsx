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
				className="bg-black"
				data-testid="back-button-icon"
			>
				<Icon name="Left" className="text-primary" />
			</IconButton>
			<span className="tg-content text-primary ml-2" data-testid="back-button-text">
				{t('components.back-btn')}
			</span>
		</div>
	);
}
