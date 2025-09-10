import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { ROUTES } from "./constants";
import Home from "./pages/Home";
import Registration from "./pages/Registration";
import Quiz from "./pages/Quiz";
import Results from "./pages/Results";
import Leaderboard from "./pages/Leaderboard";
import AvatarBuilder from "./pages/AvatarBuilder";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <AppProvider>
      <Toaster richColors position="bottom-right" />

      <Router>
        <Routes>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.REGISTRATION} element={<Registration />} />
          <Route path={ROUTES.QUIZ} element={<Quiz />} />
          <Route path={ROUTES.RESULTS} element={<Results />} />
          <Route path={ROUTES.LEADERBOARD} element={<Leaderboard />} />
          <Route path={ROUTES.AVATAR} element={<AvatarBuilder />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
