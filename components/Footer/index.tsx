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
		<div>
			<div className={`pb-12 ${isYams ? '' : 'bg-background-dark'}`}></div>
			<footer
				className={`${
					isYams ? 'bg-primary-light text-slate-1000' : 'border-t border-slate-800 text-slate-500'
				} 
			flex justify-between items-center px-3 sm:px-10 pt-4 pb-6`}
			>
				<Link
					href="https://docs.infinex.io/governance/elections-and-voting/governance-farming"
					target="_blank"
					className="flex items-center gap-2 text-xs font-semibold"
				>
					Farming Docs
					<UpRightArrow fill={fill} />
				</Link>

				{!isYams && (
					<p className="flex items-center text-xs font-semibold ml-3 text-slate-900">
						*Not forked from Synthetix
					</p>
				)}

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
		</div>
	);
}
