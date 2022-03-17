import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from './i18n/en.json';

i18n.use(initReactI18next).init({
	resources: {
		en: { translation: resources },
	},
	debug: process.env.NODE_ENV === 'development',
	lng: 'en',
	fallbackLng: 'en',
	interpolation: {
		escapeValue: false,
	},
});

export default i18n;
