import AppShell, { type AppShellProps } from "./app/AppShell";
import './config/amplify';

function App(props: Readonly<AppShellProps>) {
  return <AppShell {...props} />;
}

export default App;
