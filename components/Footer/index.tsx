import { Card } from '@synthetixio/ui';
import { DiscordIcon, GitHubIcon, TwitterIcon, SNXIcon } from 'components/old-ui';
import Link from 'next/link';

import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const LINKS = [
	{
		title: 'footer.home',
		link: '/',
	},
	{
		title: 'footer.councils',
		link: '/councils',
	},
];

export default function Footer() {
	const { t } = useTranslation();
	return (
		<footer className="bg-[url('/footer.svg')] bg-cover bg-no-repeat bg-dark-blue flex flex-col items-center gap-y-4 py-4">
			<div className="flex justify-center gap-4">
				{LINKS.map((link) => (
					<Link key={link.title} href={link.link} passHref>
						<span className="text-white tg-caption text-gray-500 cursor-pointer">
							{t(link.title)}
						</span>
					</Link>
				))}
			</div>
			<StyledSNXIcon />
			<span className="tg-caption text-white">{t('footer.copyright')}</span>
			<Card className="flex gap-2" wrapperClassName="rounded-full">
				<Link href="https://discord.com/invite/AEdUHzt" passHref>
					<a rel="noreferrer" target="_blank">
						<DiscordIcon fill="white" />
					</a>
				</Link>
				<Link href="https://twitter.com/synthetix_io" passHref>
					<a rel="noreferrer" target="_blank">
						<TwitterIcon fill="white" />
					</a>
				</Link>
				<Link href="https://github.com/synthetixio" passHref>
					<a rel="noreferrer" target="_blank">
						<GitHubIcon fill="white" />
					</a>
				</Link>
			</Card>
		</footer>
	);
}

const StyledSNXIcon = styled(SNXIcon)`
	width: 42px;
	height: 30px;
`;
