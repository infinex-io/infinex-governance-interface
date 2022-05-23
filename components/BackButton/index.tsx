import { IconButton } from '@synthetixio/ui';
import { ArrowLeftIcon } from 'components/old-ui';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

export default function BackButton() {
	const { push } = useRouter();
	const { t } = useTranslation();
	return (
		<div className="flex items-center absolute top-[100px] left-[50px]">
			<IconButton
				onClick={() => push({ pathname: '/' })}
				rounded
				size="sm"
				className="bg-black bg-gradient-to-l from-gray-800"
			>
				<ArrowLeftIcon active />
			</IconButton>
			<span className="tg-content text-primary ml-2">{t('councils.back-btn')}</span>
		</div>
	);
}
