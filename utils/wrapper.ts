import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

export function getWrapper(config?: any) {
	return ({ children }: { children: ReactNode }) =>
		QueryClientProvider({ client: new QueryClient(config), children });
}
