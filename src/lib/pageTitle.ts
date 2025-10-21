export function pageTitleForPath(pathname: string): string {
  if (pathname === '/' || pathname === '') return 'Overview';
  if (pathname.startsWith('/transactions')) return 'Transactions';
  if (pathname.startsWith('/insights')) return 'Insights';
  if (pathname.startsWith('/style-guide')) return 'Style Guide';
  return 'Page Not Found';
}
