import { Amplify } from "aws-amplify";
import AppShell, { type AppShellProps } from "./app/AppShell";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID || "",
      userPoolClientId: import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID || "",
    },
  },
});

function App(props: Readonly<AppShellProps>) {
  return <AppShell {...props} />;
}

export default App;
