import Main from 'components/Main';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ProfileSection from 'components/Profile';
import { isWalletAddress } from 'utils/validate';
import { t } from 'i18next';
import { Loader } from 'components/Loader/Loader';

export default function Profile() {
	const router = useRouter();
	const { address } = router.query;

	return (
		<>
			<Head>
				<title>Infinex | {address ? address : 'Profile'}</title>
			</Head>
			<Main>
				{router.isReady ? (
					typeof address === 'string' && isWalletAddress(address) ? (
						<ProfileSection walletAddress={address} />
					) : (
						<div className="px-8 sm:px-0 flex flex-col justify-center items-center bg-surface gap-10 text-white" style={{ height: 'calc(100vh - 256px)' }}>
      
						{/* Icon */}
						<div className="icon">
							🌟
						</div>
						
						{/* Your Stats heading */}
						<h1 className="text-2xl">Your Stats</h1>

						{/* Table */}
						<div className="hidden sm:table border-b border-white">
							<div className="table-row">
							{['Heading1', 'Heading2', 'Heading3', 'Heading4', 'Heading5'].map((heading, index) => (
								<div key={index} className="table-cell px-4 py-2">{heading}</div>
							))}
							</div>
							<div className="table-row">
							{['Data1', 'Data2', 'Data3', 'Data4', 'Data5'].map((data, index) => (
								<div key={index} className="table-cell px-4 py-2">{data}</div>
							))}
							</div>
						</div>

						{/* Collapsible table for mobile */}
						<div className="sm:hidden flex flex-col">
							{['Heading1', 'Heading2', 'Heading3', 'Heading4', 'Heading5'].map((heading, index) => (
							<div key={index} className="px-4 py-2 border-b border-white">
								{heading}: {'Data' + (index + 1)}
							</div>
							))}
						</div>

						{/* Your Pools heading */}
						<h1 className="text-2xl">Your Pools</h1>

						{/* Pool Boxes */}
						<div className="flex flex-wrap justify-center">
							{[1, 2, 3, 4].map((_, index) => (
							<div key={index} className="w-full sm:w-1/2 p-4">
								<div className="flex flex-col items-center p-4 bg-gray-700 rounded">
								
								{/* Box Heading */}
								<h2 className="text-xl">Pool {index + 1}</h2>
								
								{/* Buttons */}
								<div className="flex">
									<button className="px-4 py-2 mr-2 bg-blue-500 rounded">Button 1</button>
									<button className="px-4 py-2 ml-2 bg-blue-500 rounded">Button 2</button>
								</div>

								{/* Data Points */}
								<div className="grid grid-cols-2 gap-4 mt-4">
									{['Data1', 'Data2', 'Data3', 'Data4'].map((data, idx) => (
									<div key={idx}>
										<h3 className="text-sm">{`Heading ${idx + 1}`}</h3>
										<p>{data}</p>
									</div>
									))}
								</div>
								</div>
							</div>
							))}
						</div>
						</div>
					)
				) : (
					<Loader fullScreen />
				)}
			</Main>
		</>
	);
}
