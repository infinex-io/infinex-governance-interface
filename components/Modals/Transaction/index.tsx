import { Card } from '@synthetixio/ui';
import Image from 'next/image';
import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

interface TransactionModalProps {}

export default function TransactionModal({ children }: PropsWithChildren<TransactionModalProps>) {
	const { t } = useTranslation();
	return (
		<Card variant="gray" className="w-[350px] h-[350px] flex flex-col items-center">
			<Image width={64} height={64} src="/images/tx-status.svg" />
			<h4 className="tg-title-h4">{t('modals.transaction.headline')}</h4>
			<div className="bg-black m-4">{children}</div>
		</Card>
	);
}
