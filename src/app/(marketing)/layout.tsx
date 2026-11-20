// No layout wrapper needed for marketing pages (no sidebar)
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
