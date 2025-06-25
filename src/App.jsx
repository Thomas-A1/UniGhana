import { Routes, Route } from "react-router-dom";
import Landingpage from './pages/landing_page';
import LoginPage from './pages/login_page';
import UniversitySearch from './pages/university_search';
import ScholarshipsPage from './pages/scholarships_page';
import RegisterPage from './pages/register_page';
import VerificationModal from './components/VerificationModal';
import { Toaster } from 'react-hot-toast';
import Dashboard from "./pages/Dashboard";
import UniversityPage from "./pages/UniversityPage";
import Profile from "./pages/Profile";
import { BookmarkProvider } from "./contexts/BookmarkContext";

const App = () => {
  return (
    <>
      {/* Place Toaster once at the top level */}
      <Toaster position="top-center" reverseOrder={false} />
      <BookmarkProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/landing-page" element={<Landingpage />} />
          <Route path="/university-search" element={<UniversitySearch />} />
          <Route path="/scholarships" element={<ScholarshipsPage />} />
          <Route path="/verification" element={<VerificationModal />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/university/:id" element={<UniversityPage />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BookmarkProvider>
    </>
  );
};

export default App;
