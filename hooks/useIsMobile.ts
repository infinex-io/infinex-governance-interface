import { useEffect, useState } from 'react';

export default function useIsMobile() {
	const [isMobile, setIsMobile] = useState(false);
	const resize = () => setIsMobile(window.innerWidth < 758);
	useEffect(() => {
		if (typeof window !== 'undefined') {
			window.addEventListener('resize', resize);
		}
		return () => {
			window.removeEventListener('resize', resize);
		};
	}, [typeof window !== 'undefined']);
	return isMobile;
}
