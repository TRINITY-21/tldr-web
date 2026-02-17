export default function LoadingShimmer() {
  return (
    <div className="glass p-5 space-y-3 fade-in">
      <div className="shimmer h-4 w-24" />
      <div className="shimmer h-6 w-3/4" />
      <div className="flex gap-4">
        <div className="shimmer h-4 w-20" />
        <div className="shimmer h-4 w-28" />
        <div className="shimmer h-4 w-16" />
      </div>
    </div>
  );
}
