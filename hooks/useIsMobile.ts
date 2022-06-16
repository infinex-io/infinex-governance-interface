import { useEffect, useState } from 'react';

export default function useIsMobile() {
	const [isMobile, setIsMobile] = useState(false);
	useEffect(() => {
		setIsMobile(window.innerWidth < 758);
	}, [global.window]);
	return isMobile;
}
