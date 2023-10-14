const TimerMock = () => {
    return (
        <div
            className="bg-slate-800 rounded animate-pulse"
            data-testid="loading-state"
        >
            <div className='flex items-center invisible'>
                <span>D</span>
                <span className="mx-2">H</span>
                <span>M</span>
            </div>
        </div>
    )
}

export default TimerMock