import { Card } from '@synthetixio/ui';
import DiscordIcon from 'components/Icons/DiscordIcon';
import SNXIcon from 'components/Icons/SNXIcon';
import TwitterIcon from 'components/Icons/TwitterIcon';
import GitHubIcon from 'components/Icons/GitHubIcon';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import UpRightArrow from 'components/Icons/UpRightArrow';
import MirrorIcon from 'components/Icons/MirrorIcon';

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
		<footer className="flex justify-between items-center border-t border-slate-800 px-10 py-3 text-slate-600">
			<Link href="https://infinex.io/" target='_blank' className="flex items-center gap-3 text-sm"> 
				Infinex App
				<UpRightArrow fill="#5B5E6E" />
			</Link>
			<div className="flex gap-10 items-center">
				<Link href="https://discord.gg/infinex" passHref rel="noreferrer" target="_blank">
					<DiscordIcon fill="#5B5E6E" />
				</Link>
				<Link href="https://twitter.com/infinex_app" passHref rel="noreferrer" target="_blank">
					<TwitterIcon fill="#5B5E6E" />
				</Link>
				<Link href="http://mirror.xyz/infinex.eth" passHref rel="noreferrer" target="_blank">
					<MirrorIcon fill="#5B5E6E" />
				</Link>
			</div>
		</footer>
	);
}
