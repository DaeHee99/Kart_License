import { Route, Routes } from "react-router-dom";
import Header from './components/layout/Header';
import LandingPage from './pages/LandingPage';
import LoginPage from "./pages/LoginPage";
import TestPage from "./pages/TestPage";

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </div>
  );
}

export default App;
