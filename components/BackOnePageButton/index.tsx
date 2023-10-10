import { Icon, IconButton } from '@synthetixio/ui';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

export default function BackOnePageButton() {
	const { back } = useRouter();
	const { t } = useTranslation();
	return (
		<div className="md:flex items-center absolute top-[14%] left-[2%] left-1 translate-y-[-50%]">
			<IconButton
				onClick={() => back()}
				rounded
				size="sm"
				style={{background:'rgba(0,0,0,0)', border: 'black solid 0px'}}
				data-testid="back-button-icon"
			>
				<Icon name="Left" className="text-black" />
			</IconButton>
		</div>
	);
}
