export default function DashboardLoading() {
    return (
        <div className="mx-auto w-full max-w-md animate-pulse px-0 pb-28 md:max-w-5xl md:px-8 md:pb-16 md:pt-10">
            <div className="flex items-center justify-between p-3 pt-5 md:px-0 md:pt-0 md:pb-6">
                <div className="space-y-2">
                    <div className="h-8 w-44 rounded bg-border/60" />
                    <div className="h-4 w-64 rounded bg-border/60" />
                </div>
                <div className="h-10 w-10 rounded-full bg-border/60" />
            </div>

            <div className="space-y-4 p-3 md:p-0">
                <div className="h-36 rounded-xl bg-border/60 md:h-40" />
                <div className="h-16 rounded-xl bg-border/60" />
                <div className="h-20 rounded-xl bg-border/60" />
                <div className="space-y-3 rounded-2xl border border-border/60 p-3">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="h-14 rounded-xl bg-border/60" />
                    ))}
                </div>
            </div>
        </div>
    );
}
