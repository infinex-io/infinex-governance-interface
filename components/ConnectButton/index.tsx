// import { Button } from '@synthetixio/ui';
import { useConnectorContext } from 'containers/Connector';
import { useTranslation } from 'react-i18next';
import { Button } from 'components/button';
import clsx from 'clsx';

interface Props {
	className?: string;
}

export const ConnectButton: React.FC<Props> = ({ className = 'min-w-[142px] h-8 bg-primary text-black' }) => {
	const { connectWallet } = useConnectorContext();
	const { t } = useTranslation();
	return (
		<Button 
			className={clsx(className, "h-full")} 
			onClick={connectWallet}
			label={t('header.connect-wallet') as string}
		/>
	);
};
