import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import { useAppContext } from "./context/hooks";
import { AppProvider } from "./context/AppContext";
import { ROUTES } from "./constants";
import Home from "./pages/Home";
import Registration from "./pages/Registration";
import Quiz from "./pages/Quiz";
import Results from "./pages/Results";
import Leaderboard from "./pages/Leaderboard";
import AvatarBuilder from "./pages/AvatarBuilder";
import { Toaster } from "./components/ui/sonner";
import Feedback from "./pages/Feedback";

function TitleManager() {
  const { state } = useAppContext();
  const location = useLocation();

  useEffect(() => {
    const base = "DigiSurvive";
    const sid = state.quizResult?.student_id || state.studentInfo?.mssv || "";
    document.title = sid ? `${base} | ${sid}` : base;
  }, [state.quizResult?.student_id, state.studentInfo?.mssv, location.pathname]);

  return null;
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AppProvider>
        <Toaster richColors position="bottom-right" />

        <Router>
          <TitleManager />
          <Routes>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.REGISTRATION} element={<Registration />} />
            <Route path={ROUTES.QUIZ} element={<Quiz />} />
            <Route path={ROUTES.RESULTS} element={<Results />} />
            <Route path={ROUTES.LEADERBOARD} element={<Leaderboard />} />
            <Route path={ROUTES.AVATAR} element={<AvatarBuilder />} />
            <Route path={ROUTES.FEEDBACK} element={<Feedback />} />
          </Routes>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
