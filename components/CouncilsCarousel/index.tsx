import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CouncilCarousel } from './CouncilCarousel';
import { Icon, IconButton, Tabs } from '@synthetixio/ui';
import { TabIcon } from 'components/TabIcon';
import useCouncilMembersQuery from 'queries/members/useCouncilMembersQuery';
import { DeployedModules } from 'containers/Modules';
import { COUNCILS_DICTIONARY } from 'constants/config';

export default function CouncilsCarousel({ withoutAllMembers }: { withoutAllMembers?: boolean }) {
	const { t } = useTranslation();
	const [listView, setListView] = useState(false);
	const [activeTab, setActiveTab] = useState(withoutAllMembers ? 'spartan' : 'all-members');

	const { data: spartan } = useCouncilMembersQuery(DeployedModules.SPARTAN_COUNCIL);
	const { data: grants } = useCouncilMembersQuery(DeployedModules.GRANTS_COUNCIL);
	const { data: ambassador } = useCouncilMembersQuery(DeployedModules.AMBASSADOR_COUNCIL);
	const { data: treasury } = useCouncilMembersQuery(DeployedModules.TREASURY_COUNCIL);

	if (!spartan && !grants && !ambassador && !treasury) {
		return null;
	}
	if (spartan && grants && ambassador && treasury) {
		const allMembers = withoutAllMembers
			? [spartan, grants, ambassador, treasury]
			: [spartan.concat(grants, ambassador, treasury), spartan, grants, ambassador, treasury];

		return (
			<div className="mt-4 flex flex-col container relative">
				<Tabs
					className="mb-4 justify-start lg:mx-auto hide-scrollbar"
					contentClassName="max-w-[90vw]"
					initial={withoutAllMembers ? 'spartan' : 'all-members'}
					items={
						withoutAllMembers
							? [
									{
										id: 'spartan',
										label: (
											<div className="flex items-center gap-1">
												{t('landing-page.tabs.sc')}
												<TabIcon isActive={activeTab === 'spartan'}>{allMembers[0].length}</TabIcon>
											</div>
										),
										content: (
											<CouncilCarousel
												council={COUNCILS_DICTIONARY[0].label}
												listView={listView}
												members={allMembers[0] || []}
											/>
										),
									},
									{
										id: 'grants',
										label: (
											<div className="flex items-center gap-1">
												{t('landing-page.tabs.gc')}
												<TabIcon isActive={activeTab === 'grants'}>{allMembers[1].length}</TabIcon>
											</div>
										),
										content: (
											<CouncilCarousel
												council={COUNCILS_DICTIONARY[1].label}
												listView={listView}
												members={allMembers[1] || []}
											/>
										),
									},
									{
										id: 'ambassador',
										label: (
											<div className="flex items-center gap-1">
												{t('landing-page.tabs.ac')}
												<TabIcon isActive={activeTab === 'ambassador'}>
													{allMembers[2].length}
												</TabIcon>
											</div>
										),
										content: (
											<CouncilCarousel
												council={COUNCILS_DICTIONARY[2].label}
												listView={listView}
												members={allMembers[2] || []}
											/>
										),
									},
									{
										id: 'treasury',
										label: (
											<div className="flex items-center gap-1">
												{t('landing-page.tabs.tc')}
												<TabIcon isActive={activeTab === 'treasury'}>
													{allMembers[3].length}
												</TabIcon>
											</div>
										),
										content: (
											<CouncilCarousel
												council={COUNCILS_DICTIONARY[3].label}
												listView={listView}
												members={allMembers[3] || []}
											/>
										),
									},
							  ]
							: [
									{
										id: 'all-members',
										label: (
											<div className="flex items-center gap-1">
												{t('landing-page.tabs.all')}
												<TabIcon isActive={activeTab === 'all-members'}>
													{allMembers[0].length}
												</TabIcon>
											</div>
										),
										content: <CouncilCarousel listView={listView} members={allMembers[0] || []} />,
									},
									{
										id: 'spartan',
										label: (
											<div className="flex items-center gap-1">
												{t('landing-page.tabs.sc')}
												<TabIcon isActive={activeTab === 'spartan'}>{allMembers[1].length}</TabIcon>
											</div>
										),
										content: (
											<CouncilCarousel
												council={COUNCILS_DICTIONARY[0].label}
												listView={listView}
												members={allMembers[1] || []}
											/>
										),
									},
									{
										id: 'grants',
										label: (
											<div className="flex items-center gap-1">
												{t('landing-page.tabs.gc')}
												<TabIcon isActive={activeTab === 'grants'}>{allMembers[2].length}</TabIcon>
											</div>
										),
										content: (
											<CouncilCarousel
												council={COUNCILS_DICTIONARY[1].label}
												listView={listView}
												members={allMembers[2] || []}
											/>
										),
									},
									{
										id: 'ambassador',
										label: (
											<div className="flex items-center gap-1">
												{t('landing-page.tabs.ac')}
												<TabIcon isActive={activeTab === 'ambassador'}>
													{allMembers[3].length}
												</TabIcon>
											</div>
										),
										content: (
											<CouncilCarousel
												council={COUNCILS_DICTIONARY[2].label}
												listView={listView}
												members={allMembers[3] || []}
											/>
										),
									},
									{
										id: 'treasury',
										label: (
											<div className="flex items-center gap-1">
												{t('landing-page.tabs.tc')}
												<TabIcon isActive={activeTab === 'treasury'}>
													{allMembers[4].length}
												</TabIcon>
											</div>
										),
										content: (
											<CouncilCarousel
												council={COUNCILS_DICTIONARY[3].label}
												listView={listView}
												members={allMembers[4] || []}
											/>
										),
									},
							  ]
					}
					onChange={(id) => setActiveTab(String(id))}
				/>

				<div className="hidden lg:flex absolute right-0">
					<IconButton isActive={listView} onClick={() => setListView(true)} size="sm">
						<Icon name="List" className="text-primary" />
					</IconButton>
					<IconButton
						className="ml-1.5"
						isActive={!listView}
						onClick={() => setListView(false)}
						size="sm"
					>
						<Icon name="Grid" className="text-primary" />
					</IconButton>
				</div>
			</div>
		);
	}
	return null;
}
