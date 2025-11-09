// components/profile-card-skeleton.tsx
export default function ProfileCardSkeleton() {
	return (
		<div className="w-full max-w-2xl mx-auto shadow-lg rounded-lg overflow-hidden bg-white animate-pulse">
			{/* Header with Avatar */}
			<div className="text-center pb-6 pt-8">
				<div className="flex justify-center mb-4">
					<div className="h-24 w-24 rounded-full bg-slate-200"></div>
				</div>
				<div className="h-8 w-48 bg-slate-200 rounded-md mx-auto mb-2"></div>
				<div className="h-5 w-64 bg-slate-200 rounded-md mx-auto mb-3"></div>
				<div className="h-6 w-24 bg-slate-200 rounded-full mx-auto"></div>
			</div>

			{/* Content */}
			<div className="space-y-6 px-6 pb-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-2">
						<div className="h-5 w-24 bg-slate-200 rounded-md"></div>
						<div className="h-10 w-full bg-slate-100 rounded-md"></div>
					</div>

					<div className="space-y-2">
						<div className="h-5 w-32 bg-slate-200 rounded-md"></div>
						<div className="h-10 w-full bg-slate-100 rounded-md"></div>
					</div>
				</div>

				<div className="space-y-2">
					<div className="h-5 w-32 bg-slate-200 rounded-md"></div>
					<div className="h-10 w-full bg-slate-100 rounded-md"></div>
				</div>

				<div className="pt-4 border-t border-slate-200">
					<div className="h-5 w-36 bg-slate-200 rounded-md mb-3"></div>
					<div className="flex flex-wrap gap-3">
						<div className="h-10 w-32 bg-slate-200 rounded-md"></div>
						<div className="h-10 w-40 bg-slate-200 rounded-md"></div>
						<div className="h-10 w-44 bg-slate-200 rounded-md"></div>
					</div>
				</div>
			</div>
		</div>
	);
}
