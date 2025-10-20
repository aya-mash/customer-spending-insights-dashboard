import { ContrastCheckerDev } from '../components/ContrastChecker/ContrastCheckerFab';
import { RouterProvider } from 'react-router-dom';
import { defaultRouter } from './router';

// Type for router instance isn't exported cleanly; using 'any' with lint disable for this single prop.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface AppShellProps { readonly router?: any }

function AppShell({ router = defaultRouter }: Readonly<AppShellProps>) {
  return (
    <>
      <RouterProvider router={router} />
      <ContrastCheckerDev />
    </>
  );
}

export default AppShell;