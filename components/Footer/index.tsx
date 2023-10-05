import { Card } from '@synthetixio/ui';
import DiscordIcon from 'components/Icons/DiscordIcon';
import SNXIcon from 'components/Icons/SNXIcon';
import TwitterIcon from 'components/Icons/TwitterIcon';
import GitHubIcon from 'components/Icons/GitHubIcon';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ArrowForwardIcon } from '@chakra-ui/icons';

const LINKS = [
	{
		title: 'footer.home',
		link: '/',
	},
	{
		title: 'footer.councils',
		link: '/councils',
	},
	{
		title: 'footer.terms',
		link: 'https://infinex.io/terms',
	},
];

export default function Footer() {
	const { t } = useTranslation();
	return (
		<footer className="flex justify-between items-center border-t border-slate-800 px-10 py-3">
			<Link href="https://infinex.io/" target='_blank'>
				Infinex App
			</Link>
			<div className="flex gap-5 items-center">
				<Link href="https://discord.com/invite/AEdUHzt" passHref rel="noreferrer" target="_blank">
					<DiscordIcon fill="white" />
				</Link>
				<Link href="https://twitter.com/synthetix_io" passHref rel="noreferrer" target="_blank">
					<TwitterIcon fill="white" />
				</Link>
				<Link href="https://github.com/synthetixio" passHref rel="noreferrer" target="_blank">
					<GitHubIcon fill="white" />
				</Link>
			</div>
		</footer>
	);
}
