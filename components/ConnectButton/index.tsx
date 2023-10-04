// import { Button } from '@synthetixio/ui';
import { Button } from '@chakra-ui/react'
import { useConnectorContext } from 'containers/Connector';
import { useTranslation } from 'react-i18next';

interface Props {
	className?: string;
}

export const ConnectButton: React.FC<Props> = ({ className = 'min-w-[142px] h-8 bg-primary text-black' }) => {
	const { connectWallet } = useConnectorContext();
	const { t } = useTranslation();
	return (
		<Button 
			size="sm" 
			className={className} 
			variant="default" 
			onClick={connectWallet}
		>
			{t('header.connect-wallet')}
		</Button>
	);
};
