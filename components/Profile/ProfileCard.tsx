import { Card, ExternalLink } from '@synthetixio/ui';
import clsx from 'clsx';
import Avatar from 'components/Avatar';
import { useTranslation } from 'react-i18next';
import { currency } from 'utils/currency';

export interface ProfileCardProps {
	className?: string;
	pfpThumbnailUrl: string;
	walletAddress: string;
	discord: string;
	github: string;
	twitter: string;
	pitch: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
	className,
	pfpThumbnailUrl,
	walletAddress,
	discord,
	github,
	twitter,
	pitch,
}) => {
	const { t } = useTranslation();

	return (
		<Card variant="dark-blue" className={clsx('border border-gray-700 w-full', className)}>
			<div className="flex items-center justify-start">
				<Avatar width={69} height={69} url={pfpThumbnailUrl} walletAddress={walletAddress} />
				<div className="flex items-start justify-between">
					<div className="flex flex-col mx-5">
						<h5 className="tg-content-bold text-gray-650">{t('profiles.discord')}</h5>
						{discord && (
							<ExternalLink
								className="py-1 mt-1"
								border
								link={`https://discord.com/${discord}`}
								text="Discord"
							/>
						)}
					</div>
					<div className="flex flex-col mx-5">
						<h5 className="tg-content-bold text-gray-650">{t('profiles.twitter')}</h5>
						{twitter && (
							<ExternalLink
								className="py-1 mt-1"
								border
								link={`https://twitter.com/${twitter}`}
								text="Twitter"
							/>
						)}
					</div>

					<div className="flex flex-col mx-5">
						<h5 className="tg-content-bold text-gray-650">{t('profiles.votes')}</h5>
						<h5 className="tg-title-h5  mt-1">{currency(1252)}</h5>
					</div>
					<div className="flex flex-col mx-5">
						<h5 className="tg-content-bold text-gray-650">{t('profiles.participatedVotes')}</h5>
						<h5 className="tg-title-h5 mt-1">{currency(1252)}</h5>
					</div>
				</div>
			</div>
			<hr className="border-gray-700 my-4" />

			<div className="flex flex-col pl-[69px] ml-5">
				<h5 className="tg-content-bold text-gray-650">{t('profiles.wallet')}</h5>
				{walletAddress}
			</div>

			<hr className="border-gray-700 my-4" />
			<div className="flex flex-col pl-[69px] ml-5">
				<h5 className="tg-content-bold text-gray-650">{t('profiles.pitch')}</h5>
				{pitch}
			</div>
		</Card>
	);
};
