import { Card } from '@synthetixio/ui';
import DiscordIcon from 'components/Icons/DiscordIcon';
import SNXIcon from 'components/Icons/SNXIcon';
import TwitterIcon from 'components/Icons/TwitterIcon';
import GitHubIcon from 'components/Icons/GitHubIcon';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

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
		link: 'https://staking.synthetix.io/terms',
	},
];

export default function Footer() {
	const { t } = useTranslation();
	return (
		<footer className="bg-[url('/footer.svg')] py-6 xs:h-[325px] bg-cover bg-no-repeat bg-dark-blue flex flex-col items-center justify-center">
			<div className="flex flex-col items-center">
				<div className="hidden xs:block flex justify-center mb-6">
					{LINKS.map(({ title, link }) => (
						<Link
							key={title}
							href={link}
							passHref
							className="mx-2 text-white hover:text-primary hover:opacity-100 uppercase gt-america-font tg-body opacity-60 cursor-pointer"
							target={link.startsWith('http') ? '_blank' : undefined}
						>
							{t(title)}
						</Link>
					))}
				</div>

				<span className="xs:hidden block gt-america-font tg-caption opacity-60 text-white uppercase mb-4">
					{t('footer.copyright')}
				</span>

				{/* <div className="text-white"> */}
					<SNXIcon className="mb-6 xs:mb-3 text-white" width={46} height={30} />
				{/* </div> */}
				<span className="hidden xs:block tg-caption-sm text-white mb-7">
					{t('footer.copyright')}
				</span>
				<Card className="flex gap-4 items-center py-3" wrapperClassName="rounded-full">
					<Link href="https://discord.com/invite/AEdUHzt" passHref rel="noreferrer" target="_blank">
						<DiscordIcon fill="white" />
					</Link>
					<Link href="https://twitter.com/synthetix_io" passHref rel="noreferrer" target="_blank">
						<TwitterIcon fill="white" />
					</Link>
					<Link href="https://github.com/synthetixio" passHref rel="noreferrer" target="_blank">
						<GitHubIcon fill="white" />
					</Link>
				</Card>
			</div>
		</footer>
	);
}
