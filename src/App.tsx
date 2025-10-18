import { ContrastCheckerDev } from './components/ContrastChecker/ContrastCheckerFab';
import { RouterProvider } from 'react-router-dom';
// Type for router instance isn't exported cleanly; using 'any' with lint disable for this single prop.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface AppProps { readonly router?: any }
import { router as defaultRouter } from './app/router';


function App({ router = defaultRouter }: Readonly<AppProps>) {
  return (
    <>
      <RouterProvider router={router} />
      <ContrastCheckerDev />
    </>
  );
}

export default App;
