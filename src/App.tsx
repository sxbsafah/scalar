import { Routes, Route } from "react-router";
import SignInPage from "@/pages/SignInPage";
import ProtectedRoute from "./components/ProtectedRoute";
import SignUpPage from "@/pages/SignUpPage";
import Home from "@/layouts/Home";
import Library from "@/pages/Library";

function App() {
  return (
      <Routes>
          <Route element={<ProtectedRoute/>}>
            <Route  element={<Home />} >
              <Route index element={<Library />} />
            </Route>
          </Route>
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
      </Routes>
  )
}

export default App
