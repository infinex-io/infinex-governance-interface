import { ExternalLink } from '@synthetixio/ui';
import clsx from 'clsx';
import Avatar from 'components/Avatar';
import { CopyClipboard } from 'components/CopyClipboard/CopyClipboard';
import DiscordIcon from 'components/Icons/DiscordIcon';
import { DeployedModules } from 'containers/Modules';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { copyToClipboard, urlIsCorrect } from 'utils/helpers';
import { truncateAddress } from 'utils/truncate-address';

export interface ProfileCardProps {
	className?: string;
	pfpThumbnailUrl: string;
	walletAddress: string;
	discord: string;
	github: string;
	twitter: string;
	pitch: string;
	deployedModule?: DeployedModules;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
	className,
	pfpThumbnailUrl,
	walletAddress,
	discord,
	twitter,
	pitch,
	deployedModule,
}) => {
	const { t } = useTranslation();

	return (
		<div className={clsx('bg-background-dark border border-gray-800 w-full p-4 rounded-lg', className)}>
			<div className="flex items-center flex-wrap gap-4">
				<Avatar width={69} height={69} url={pfpThumbnailUrl} walletAddress={walletAddress} />

				{discord && (
					<div className="flex flex-col m-2">
						<h3 className="tg-content-bold text-gray-650">{t('profiles.discord')}</h3>

						<DiscordIcon
							onClick={() => {
								copyToClipboard(discord);
								toast.success(t('copy-clipboard-message'));
							}}
							className="cursor-pointer mt-2"
							fill="white"
						/>
					</div>
				)}

				{twitter && urlIsCorrect(twitter, 'https://twitter.com') && (
					<div className="flex flex-col m-2">
						<h5 className="tg-content-bold text-gray-650">{t('profiles.twitter')}</h5>
						<ExternalLink className="py-1" border link={twitter} text="Twitter" />
					</div>
				)}

				{deployedModule && walletAddress && (
					<VoteHistory deployedModule={deployedModule} walletAddress={walletAddress} />
				)}
			</div>
			<hr className="border-gray-800 my-4" />

			<div className="flex flex-col md:pl-[69px] ml-5 break-words">
				<h5 className="tg-content-bold text-gray-650">{t('profiles.wallet')}</h5>
				<h3 className="flex items-center tg-title-h3">
					{truncateAddress(walletAddress)}
					<CopyClipboard className="ml-1.5" text={walletAddress} />
				</h3>
			</div>
			{pitch && (
				<>
					<hr className="border-gray-800 my-4" />
					<div className="flex flex-col md:pl-[69px] ml-5 whitespace-pre-line">
						<h5 className="tg-content-bold text-gray-650">{t('profiles.pitch')}</h5>
						{pitch}
					</div>
				</>
			)}
		</div>
	);
};

const VoteHistory = ({
	deployedModule,
	walletAddress,
}: {
	deployedModule: DeployedModules;
	walletAddress: string;
}) => {
	const { t } = useTranslation();
	return (
		<div className="flex flex-col mx-5">
			<h5 className="tg-content-bold text-gray-650">{t('profiles.votes')}</h5>
			<h3 className="tg-title-h3 mt-1">{0}</h3>
		</div>
	);
};
