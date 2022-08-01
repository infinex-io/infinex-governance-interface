import { Button } from '@synthetixio/ui';
import { useConnectorContext } from 'containers/Connector';
import { useTranslation } from 'react-i18next';

interface Props {
	className?: string;
}

export const ConnectButton: React.FC<Props> = ({ className = 'min-w-[142px]' }) => {
	const { connectWallet } = useConnectorContext();
	const { t } = useTranslation();
	return (
		<Button className={className} variant="outline" onClick={connectWallet}>
			{t('header.connect-wallet')}
		</Button>
	);
};
