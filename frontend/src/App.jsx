import AppRoutes from "./AppRoutes";
import { AuthProvider } from "./features/Auth/auth.context";

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App;