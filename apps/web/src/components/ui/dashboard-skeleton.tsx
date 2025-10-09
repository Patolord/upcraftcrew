import { Skeleton } from "@/components/ui/skeleton";

type SkeletonVariant = "stats" | "activities" | "deadlines" | "projects";

interface DashboardSkeletonProps {
	variant: SkeletonVariant;
}

export function DashboardSkeleton({ variant }: DashboardSkeletonProps) {
	switch (variant) {
		case "stats":
			return (
				<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
					{[...Array(5)].map((_, i) => (
						<div key={i} className="stats shadow border border-base-300">
							<div className="stat py-4">
								<div className="stat-figure">
									<Skeleton className="size-8 rounded-full" />
								</div>
								<Skeleton className="h-3 w-20 mb-2" />
								<Skeleton className="h-6 w-12 mb-2" />
								<Skeleton className="h-3 w-24" />
							</div>
						</div>
					))}
				</div>
			);

		case "activities":
			return (
				<div className="card bg-base-100 border border-base-300">
					<div className="card-body">
						<Skeleton className="h-6 w-40 mb-4" />
						<div className="space-y-4">
							{[...Array(4)].map((_, i) => (
								<div
									key={i}
									className="flex items-start gap-3 pb-4 border-b border-base-300 last:border-0 last:pb-0"
								>
									<Skeleton className="w-10 h-10 rounded-full" />
									<div className="flex-1 min-w-0 space-y-2">
										<Skeleton className="h-4 w-3/4" />
										<Skeleton className="h-3 w-20" />
									</div>
									<Skeleton className="h-5 w-16 rounded-full" />
								</div>
							))}
						</div>
						<div className="card-actions justify-end mt-4 pt-4 border-t border-base-300">
							<Skeleton className="h-8 w-32" />
						</div>
					</div>
				</div>
			);

		case "deadlines":
			return (
				<div className="card bg-base-100 border border-base-300">
					<div className="card-body">
						<Skeleton className="h-6 w-40 mb-4" />
						<div className="space-y-3">
							{[...Array(4)].map((_, i) => (
								<div
									key={i}
									className="flex items-start justify-between gap-3 pb-3 border-b border-base-300 last:border-0 last:pb-0"
								>
									<div className="flex-1 min-w-0 space-y-2">
										<Skeleton className="h-4 w-32" />
										<Skeleton className="h-3 w-20" />
									</div>
									<Skeleton className="h-5 w-10 rounded-full" />
								</div>
							))}
						</div>
					</div>
				</div>
			);

		case "projects":
			return (
				<div className="card bg-base-100 border border-base-300">
					<div className="card-body">
						<div className="flex items-center justify-between mb-4">
							<Skeleton className="h-6 w-32" />
							<Skeleton className="h-8 w-24" />
						</div>
						<div className="space-y-4">
							{[...Array(5)].map((_, i) => (
								<div key={i}>
									<div className="flex items-center justify-between mb-2">
										<div className="flex items-center gap-3 flex-1 min-w-0">
											<div className="avatar-group -space-x-3">
												{[...Array(3)].map((_, j) => (
													<Skeleton key={j} className="w-6 h-6 rounded-full" />
												))}
											</div>
											<Skeleton className="h-4 w-40" />
										</div>
										<div className="flex items-center gap-3">
											<Skeleton className="h-3 w-20" />
											<Skeleton className="h-4 w-12" />
										</div>
									</div>
									<Skeleton className="h-2 w-full rounded-full" />
								</div>
							))}
						</div>
					</div>
				</div>
			);
	}
}
