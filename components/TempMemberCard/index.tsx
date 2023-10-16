import clsx from 'clsx';
import ProfileIcon from 'components/Icons/ProfileIcon';

interface Props {
    council: string | undefined
}
export default function TempMemberCard({ council }: Props) {
    return (
        <div className={clsx('p-0.5 rounded-lg w-full xs:max-w-[210px] min-w-[210px] h-[285px] bg-slate-800')}>
            <div className={'bg-slate-900 relative flex flex-col items-center justify-between p-4 rounded-lg h-full py-10'}>
                <ProfileIcon width={45} height={45} />
                <span
                    className={`bg-[#15262A] text-[#31C690] p-2 rounded font-medium text-[11px] text-center my-2 uppercase w-fit self-center`}
                    data-testid="cta-text"
                >
                    {council} Seat
                </span>
                <div className="text-center w-full flex flex-col items-center">
                    <h5 className="tg-title-h5 capitalize">
                        0x000...DEaD
                    </h5>
			        <span className="bg-slate-800 h-[1px] w-full my-5"></span>
                    <div className="text-slate-100 text-sm">To be filled</div>
                </div>
            </div>
        </div>
    );
}
