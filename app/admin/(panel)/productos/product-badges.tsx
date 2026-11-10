export default function ProductBadges({ isHotmart, needsReview }: { isHotmart: boolean; needsReview: boolean }) {
  if (!isHotmart && !needsReview) return null;
  return (
    <span className="inline-flex flex-wrap gap-1 ml-2 align-middle">
      {isHotmart && (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">Hotmart</span>
      )}
      {needsReview && (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
          Revisar enlace
        </span>
      )}
    </span>
  );
}
