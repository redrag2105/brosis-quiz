import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { useEffect, type JSX } from "react";
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
    const sid = state.studentInfo?.mssv || "";
    document.title = sid ? `${base} | ${sid}` : base;
    return () => {
      document.title = base;
    };
  }, [state.studentInfo, location.pathname]);

  return null;
}

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const allowed =
    typeof window !== "undefined" &&
    window.localStorage.getItem("quizKey") === "1409070405";
  return allowed ? children : <Navigate to={ROUTES.HOME} replace />;
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
            <Route path={ROUTES.LEADERBOARD} element={<Leaderboard />} />

            <Route
              path={ROUTES.REGISTRATION}
              element={
                <ProtectedRoute>
                  <Registration />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.QUIZ}
              element={
                <ProtectedRoute>
                  <Quiz />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.RESULTS}
              element={
                <ProtectedRoute>
                  <Results />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.AVATAR}
              element={
                <ProtectedRoute>
                  <AvatarBuilder />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.FEEDBACK}
              element={
                <ProtectedRoute>
                  <Feedback />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
