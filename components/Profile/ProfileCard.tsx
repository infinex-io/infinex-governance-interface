import { Card, ExternalLink } from '@synthetixio/ui';
import clsx from 'clsx';
import Avatar from 'components/Avatar';
import { CopyClipboard } from 'components/CopyClipboard/CopyClipboard';
import { DiscordIcon } from 'components/old-ui';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { currency } from 'utils/currency';
import { copytoClipboard } from 'utils/helpers';
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
					className="md:block hidden mx-2"
				/>

				{discord && (
					<div className="flex flex-col items-start m-2">
						<h5 className="tg-content-bold text-gray-650">{t('profiles.discord')}</h5>

						<DiscordIcon
							onClick={() => {
								copytoClipboard(discord);
								toast.success(t('copyClipboardMessage'));
							}}
							className="cursor-pointer mt-2"
							fill="white"
						/>
					</div>
				)}

				{twitter && (
					<div className="flex flex-col items-start m-2">
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
					<h5 className="tg-title-h5  mt-1">{currency(1252)}</h5>
				</div>
				<div className="flex flex-col mx-5">
					<h5 className="tg-content-bold text-gray-650 ">{t('profiles.participatedVotes')}</h5>
					<h5 className="tg-title-h5 mt-1">{currency(1252)}</h5>
				</div>
			</div>
			<hr className="border-gray-700 my-4" />

			<div className="flex flex-col md:pl-[69px] ml-5">
				<h5 className="tg-content-bold text-gray-650">{t('profiles.wallet')}</h5>
				<p className="flex items-center">
					{truncateAddress(walletAddress)}
					<CopyClipboard className="ml-1.5" text={walletAddress} />
				</p>
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
