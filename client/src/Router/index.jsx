import { Route, Routes } from "react-router-dom";
import Auth from "../hoc/Auth";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import TestPage from "../pages/TestPage";
import ResultPage from "../pages/ResultPage";
import MyPage from "../pages/MyPage";
import StatisticsPage from "../pages/StatisticsPage";
import AdminPage from "../pages/AdminPage";
import UserPage from "../pages/UserPage";
import TablePage from "../pages/TablePage";

function Router() {
  const AuthLandingPage = Auth(LandingPage, null);
  const AuthLoginPage = Auth(LoginPage, false);
  const AuthTestPage = Auth(TestPage, null);
  const AuthResultPage = Auth(ResultPage, null);
  const AuthMyPage = Auth(MyPage, true);
  const AuthStatisticsPage = Auth(StatisticsPage, null);
  const AuthAdminPage = Auth(AdminPage, true, true);
  const AuthUserPage = Auth(UserPage, null);
  const AuthTablePage = Auth(TablePage, null);

  return (
    <Routes>
      <Route path="/" element={<AuthLandingPage />} />
      <Route path="/login" element={<AuthLoginPage />} />
      <Route path="/test" element={<AuthTestPage />} />
      <Route path="/result/:id" element={<AuthResultPage />} />
      <Route path="/mypage" element={<AuthMyPage />} />
      <Route path="/statistics" element={<AuthStatisticsPage />} />
      <Route path="/admin" element={<AuthAdminPage />} />
      <Route path="/userpage/:id" element={<AuthUserPage />} />
      <Route path="/table" element={<AuthTablePage />} />
    </Routes>
  );
}

export default Router;
