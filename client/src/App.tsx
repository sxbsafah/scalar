import { Routes, Route } from "react-router";
import SignInPage from "@/pages/SignInPage";
import ProtectedRoute from "./components/ProtectedRoute";
import SignUpPage from "@/pages/SignUpPage";
import Home from "@/layouts/Home";
import Library from "@/pages/Library";
import PaymentSucess from "./pages/PaymentSuccess";
import Billing from "./pages/Billing";
import Notifications from "@/pages/Notifications";
import { UserProvider } from "./providers/UserProvider";

function App() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route
          element={
            <UserProvider>
              <Home />
            </UserProvider>
          }
        >
          <Route index element={<Library />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
      </Route>
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="/pro/sucess" element={<PaymentSucess />} />
    </Routes>
  );
}

export default App;
