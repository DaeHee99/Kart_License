import { Route, Routes } from "react-router-dom";
import Auth from "./hoc/Auth";
import Header from "./components/layout/Header";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import TestPage from "./pages/TestPage";
import ResultPage from "./pages/ResultPage";
import MyPage from "./pages/MyPage";
import StatisticsPage from "./pages/StatisticsPage";
import ManagerPage from "./pages/ManagerPage";
import UserPage from "./pages/UserPage";
import ServerPage from "./pages/ServerPage";

function App() {
  const AuthLandingPage = Auth(LandingPage, null);
  const AuthLoginPage = Auth(LoginPage, false);
  const AuthTestPage = Auth(TestPage, null);
  const AuthResultPage = Auth(ResultPage, null);
  const AuthMyPage = Auth(MyPage, true);
  const AuthStatisticsPage = Auth(StatisticsPage, null);
  const AuthManagerPage = Auth(ManagerPage, true, true);
  const AuthUserPage = Auth(UserPage, null);

  return (
    <div>
      <Header />
      <Routes>
        <Route path="*" element={<ServerPage />} />
        {/* <Route path="/" element={<AuthLandingPage />} />
        <Route path="/login" element={<AuthLoginPage />} />
        <Route path="/test" element={<AuthTestPage />} />
        <Route path="/result/:id" element={<AuthResultPage />} />
        <Route path="/mypage" element={<AuthMyPage />} />
        <Route path="/statistics" element={<AuthStatisticsPage />} />
        <Route path="/manager" element={<AuthManagerPage />} />
        <Route path="/userpage/:id" element={<AuthUserPage />} /> */}
      </Routes>
    </div>
  );
}

export default App;
