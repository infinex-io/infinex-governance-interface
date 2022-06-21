import { Badge } from '@synthetixio/ui';
import { BadgeVariant } from '@synthetixio/ui/dist/types/components/Badge/Badge';
import clsx from 'clsx';
import { DeployedModules } from 'containers/Modules';

interface Props {
	council: DeployedModules;
	className?: string;
}

const councilVariant = {
	[DeployedModules.SPARTAN_COUNCIL]: 'blue',
	[DeployedModules.GRANTS_COUNCIL]: 'success',
	[DeployedModules.AMBASSADOR_COUNCIL]: 'orange',
	[DeployedModules.TREASURY_COUNCIL]: 'yellow',
};

export const CouncilBadge: React.FC<Props> = ({ council, className }) => {
	return (
		<Badge
			variant={councilVariant[council] as BadgeVariant}
			className={clsx(className, 'capitalize')}
		>
			{council}
		</Badge>
	);
};
