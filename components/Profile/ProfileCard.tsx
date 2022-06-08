import { Card, ExternalLink } from '@synthetixio/ui';
import clsx from 'clsx';
import Avatar from 'components/Avatar';
import { useTranslation } from 'react-i18next';
import { currency } from 'utils/currency';
import { truncateAddress } from 'utils/truncate-address';

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
	twitter,
	pitch,
}) => {
	const { t } = useTranslation();

	return (
		<Card wrapperClassName={clsx('border border-gray-700 w-full', className)}>
			<div className="flex items-center flex-wrap">
				<Avatar
					width={69}
					height={69}
					url={pfpThumbnailUrl}
					walletAddress={walletAddress}
					className="md:block hidden"
				/>

				{discord && (
					<div className="flex flex-col items-center m-2">
						<h5 className="tg-content-bold text-gray-650">{t('profiles.discord')}</h5>
						<ExternalLink
							className="py-1 mt-1"
							border
							link={`https://discord.com/${discord}`}
							text="Discord"
						/>
					</div>
				)}

				{twitter && (
					<div className="flex flex-col items-center m-2">
						<h5 className="tg-content-bold text-gray-650">{t('profiles.twitter')}</h5>
						<ExternalLink
							className="py-1 mt-1"
							border
							link={`https://twitter.com/${twitter}`}
							text="Twitter"
						/>
					</div>
				)}

				<div className="flex flex-col mx-5">
					<h5 className="tg-content-bold text-gray-650">{t('profiles.votes')}</h5>
					<h5 className="tg-title-h5  mt-1 text-center">{currency(1252)}</h5>
				</div>
				<div className="flex flex-col mx-5">
					<h5 className="tg-content-bold text-gray-650 ">{t('profiles.participatedVotes')}</h5>
					<h5 className="tg-title-h5 mt-1 text-center">{currency(1252)}</h5>
				</div>
			</div>
			<hr className="border-gray-700 my-4" />

			<div className="flex flex-col md:pl-[69px] ml-5">
				<h5 className="tg-content-bold text-gray-650">{t('profiles.wallet')}</h5>
				{truncateAddress(walletAddress)}
			</div>
			{pitch && (
				<>
					<hr className="border-gray-700 my-4" />
					<div className="flex flex-col md:pl-[69px] ml-5 whitespace-pre">
						<h5 className="tg-content-bold text-gray-650">{t('profiles.pitch')}</h5>
						{pitch}
					</div>
				</>
			)}
		</Card>
	);
};
