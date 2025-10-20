import AppShell, { type AppShellProps } from './app/AppShell';

function App(props: Readonly<AppShellProps>) {
  return <AppShell {...props} />;
}

export default App;
