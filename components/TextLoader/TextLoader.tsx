const TextLoader = ({ text }: { text: string }) => {
	return (
		<div className="bg-slate-800 rounded animate-pulse" data-testid="loading-state">
			<span className="invisible">{text}</span>
		</div>
	);
};

export default TextLoader;
