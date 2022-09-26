import { Table } from '@synthetixio/ui';
import DiscordIcon from 'components/Icons/DiscordIcon';
import TwitterIcon from 'components/Icons/TwitterIcon';
import GitHubIcon from 'components/Icons/GitHubIcon';
import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { copyToClipboard, urlIsCorrect } from 'utils/helpers';
import { toast } from 'react-toastify';
import clsx from 'clsx';

interface UserSocialsProps {
	discord: string;
	twitter: string;
	github: string;
	fill?: string;
	small?: boolean;
}

export const UserSocials: React.FC<UserSocialsProps> = ({
	discord,
	twitter,
	github,
	fill = 'white',
	small,
}) => {
	const { t } = useTranslation();

	return (
		<>
			{discord && (
				<DiscordIcon
					onClick={() => {
						copyToClipboard(discord);
						toast.success(t('components.copy-clipboard-message'));
					}}
					className={clsx('cursor-pointer', { 'scale-75': small })}
					fill={fill}
				/>
			)}

			{twitter && urlIsCorrect(twitter, 'https://twitter.com') && (
				<Link href={twitter} passHref>
					<a rel="noreferrer" target="_blank">
						<TwitterIcon className={clsx({ 'scale-75': small })} fill={fill} />
					</a>
				</Link>
			)}
			{github && urlIsCorrect(github, 'https://github.com') && (
				<Link href={github} passHref>
					<a rel="noreferrer" target="_blank">
						<GitHubIcon className={clsx({ 'scale-75': small })} fill={fill} />
					</a>
				</Link>
			)}
		</>
	);
};
