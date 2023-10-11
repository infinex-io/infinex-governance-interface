import Main from 'components/Main';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Button } from 'components/button';

const FourOhFour: NextPage = () => {
	const { t } = useTranslation();
	return <>
        <Head>
            <title>404 | Page not found</title>
        </Head>
        <Main>
            <div className="w-full flex flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center text-center -mt-24">
                    <h1 className="tg-title-h1 hidden md:block">{t('404.title')}</h1>
                    <h1 className="tg-title-h3 block md:hidden">{t('404.title')}</h1>
                    <p className="tg-content mt-3 mb-7">{t('404.caption')}</p>
                    <Link href="/" passHref rel="noreferrer">
                        <Button 
                            className="min-w-[296px]"
                            label={t('404.backToHomepage') as string}
                        />
                    </Link>
                </div>
            </div>
        </Main>
    </>;
};

export default FourOhFour;
