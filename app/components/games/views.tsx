export function LibraryView({ children }: { children: React.ReactNode }) {
	return (
		<div className="grid grid-cols-1 gap-4 rounded-md md:w-full md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
			{children}
		</div>
	);
}
