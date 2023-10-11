import EditModal from 'components/Modals/EditNomination';
import WithdrawNominationModal from 'components/Modals/WithdrawNomination';
import { useModalContext } from 'containers/Modal';
import { useRouter } from 'next/router';
import { GetUserDetails } from 'queries/boardroom/useUserDetailsQuery';
import { useTranslation } from 'react-i18next';
import VoteModal from 'components/Modals/Vote';
import { IconButton, Dropdown, Icon } from '@synthetixio/ui';
import Link from 'next/link';
import { EpochPeriods } from 'queries/epochs/useCurrentPeriodQuery';
import { DeployedModules } from 'containers/Modules';
import WithdrawVoteModal from 'components/Modals/WithdrawVote';
import { compareAddress } from 'utils/helpers';
import clsx from 'clsx';
import { Button } from 'components/button';

interface Props {
	state: keyof typeof EpochPeriods;
	deployedModule?: DeployedModules;
	isOwnCard: boolean;
	member: GetUserDetails;
	votedFor?: string;
	walletAddress: string;
	council?: string;
}

export const MemberCardAction: React.FC<Props> = ({
	state,
	isOwnCard,
	member,
	votedFor,
	walletAddress,
	deployedModule,
	council,
}) => {
	const { t } = useTranslation();
	const { push } = useRouter();
	const { setContent, setIsOpen } = useModalContext();
	const votedForAlready = compareAddress(votedFor, walletAddress);
	return <>
        {state === 'ADMINISTRATION' && (
            <div
                className={clsx('rounded')}
            >
                <Button
                    className="w-[130px]"
                    variant="outline"
                    onClick={(e) => {
                        e.stopPropagation();
                        push('/profile/' + member.address);
                    }}
                    label={t('councils.view-member') as string}
                />
            </div>
        )}

        {state === 'NOMINATION' && (
            <div className="flex gap-2 items-center">
                <Button
                    className={clsx({ 'w-[130px]': !isOwnCard })}
                    variant="outline"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (isOwnCard) {
                            setContent(<EditModal deployedModule={deployedModule!} council={council!} />);
                            setIsOpen(true);
                        } else {
                            push('/profile/' + member.address);
                        }
                    }}
                   label={isOwnCard ? t('councils.edit-nomination') as string : t('councils.view-nominee') as string}
                />

                {isOwnCard && (
                    <Dropdown
                        triggerElement={
                            <IconButton size="sm" className="h-[35px] bg-transparent focus:text-slate-300 hover:border-slate-800 
                            focus:border-slate-600">
                                <Icon className="text-xl" name="Vertical" />
                            </IconButton>
                        }
                        contentClassName="bg-slate-1000 flex flex-col dropdown-border overflow-hidden"
                        triggerElementProps={({ isOpen }: any) => ({ isActive: isOpen })}
                        contentAlignment="right"
                        renderFunction={({ handleClose }) => (
                            <div className="flex flex-col text-xs">
                                <span
                                    className="hover:bg-slate-900 p-2 text-slate-200 cursor-pointer"
                                    onClick={() => {
                                        handleClose();
                                        setContent(
                                            <WithdrawNominationModal
                                                deployedModule={deployedModule!}
                                                council={council!}
                                            />
                                        );
                                        setIsOpen(true);
                                    }}
                                >
                                    {t('councils.dropdown.withdraw')}
                                </span>
                                <Link
                                    href={`/profile/${member.address}`}
                                    passHref
                                    className="hover:bg-slate-900 p-2 text-slate-200 cursor-pointer">

                                    {t('councils.dropdown.edit')}

                                </Link>
                                <Link
                                    href={`https://optimistic.etherscan.io/address/${member.address}`}
                                    passHref
                                    key="etherscan-link"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:bg-slate-900 p-2 text-slate-200 cursor-pointer">

                                    <span key={`${member.address}-title`} color="lightBlue">
                                        {t('councils.dropdown.etherscan')}
                                    </span>

                                </Link>
                            </div>
                        )}
                    />
                )}
            </div>
        )}

        {state === 'VOTING' && (
            <>
                <div className="flex flex-col">
                    <Button
                        className={clsx('w-full', { 'mr-2': isOwnCard })}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (votedForAlready) {
                                setContent(
                                    <WithdrawVoteModal
                                        member={member}
                                        council={council!}
                                        deployedModule={deployedModule!}
                                    />
                                );
                            } else {
                                setContent(
                                    <VoteModal
                                        member={member}
                                        deployedModule={deployedModule!}
                                        council={council!}
                                    />
                                );
                            }
                            setIsOpen(true);
                        }}
                        label={votedForAlready ? t('vote.withdraw') as string: t('vote.vote-nominee') as string}
                    />
                    {!isOwnCard && (
                        <Button
                            variant='outline'
                            className="cursor-pointer text-center mt-3"
                            onClick={() => push('/profile/'.concat(walletAddress))}
                            label={t('councils.view-nominee') as string}
                        />
                    )}
                </div>
                {isOwnCard && (
                    <Dropdown
                        triggerElement={
                            <IconButton size="sm" className="h-[35px] bg-transparent focus:color-slate-900 ">
                                <Icon className="text-xl" name="Vertical" />
                            </IconButton>
                        }
                        contentClassName="bg-slate-1000 flex flex-col dropdown-border overflow-hidden"
                        triggerElementProps={({ isOpen }: any) => ({ isActive: isOpen })}
                        contentAlignment="right"
                        renderFunction={() => (
                            <div className="flex flex-col">
                                <Link
                                    href={`/profile/${member.address}`}
                                    passHref
                                    className="hover:bg-slate-900 p-2 text-slate-100 cursor-pointer">

                                    {t('councils.dropdown.edit')}

                                </Link>
                                <Link
                                    href={`https://optimistic.etherscan.io/address/${member.address}`}
                                    passHref
                                    key="etherscan-link"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:bg-slate-900 p-2 text-slate-100 cursor-pointer">

                                    <span key={`${member.address}-title`} color="lightBlue">
                                        {t('councils.dropdown.etherscan')}
                                    </span>

                                </Link>
                            </div>
                        )}
                    />
                )}
            </>
        )}
    </>;
};
