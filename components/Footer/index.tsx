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
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Footer() {
	const [isYams, setIsYams] = useState(false);
	const { asPath, push } = useRouter();
	const [fill, setFill] = useState('');

	useEffect(() => {
		if (asPath.includes('/farming')) {
			setIsYams(true);
			setFill('black');
		} else {
			setIsYams(false);
			setFill('#5B5E6E');
		}
	}, [asPath]);

	return (
		<footer
			className={`${
				isYams ? 'bg-primary-light text-slate-1000' : 'border-t border-slate-800 text-slate-500'
			} 
		flex justify-between items-center px-3 sm:px-10 pt-3 pb-6`}
		>
			<Link href="https://docs.infinex.io/" target="_blank" className="flex items-center gap-3 text-sm">
				Infinex Docs
				<UpRightArrow fill={fill} />
			</Link>
			<div className="flex gap-4 items-center">
				<Link href="https://discord.gg/infinex" passHref rel="noreferrer" target="_blank">
					<DiscordIcon fill={fill} />
				</Link>
				<Link href="https://twitter.com/infinex_app" passHref rel="noreferrer" target="_blank">
					<TwitterIcon fill={fill} />
				</Link>
				<Link href="http://mirror.xyz/infinex.eth" passHref rel="noreferrer" target="_blank">
					<MirrorIcon fill={fill} />
				</Link>
			</div>
		</footer>
	);
}
