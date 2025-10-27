import { Routes, Route, useLocation } from "react-router";
import SignInPage from "@/pages/SignInPage";
import ProtectedRoute from "./components/ProtectedRoute";
import SignUpPage from "@/pages/SignUpPage";
import Home from "@/layouts/Home";
import Library from "@/pages/Library";

function App() {
  console.log(useLocation().pathname);
  return (
    <main>
      <Routes>
          <Route element={<ProtectedRoute/>}>
            <Route  element={<Home />} >
              <Route index element={<Library />} />
            </Route>
          </Route>
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
      </Routes>
    </main>
  )
}

export default App
