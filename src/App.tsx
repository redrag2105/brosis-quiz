import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ROUTES } from './constants';
import Home from './pages/Home';
import Registration from './pages/Registration';
import Quiz from './pages/Quiz';
import Results from './pages/Results';
import Leaderboard from './pages/Leaderboard';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.REGISTRATION} element={<Registration />} />
          <Route path={ROUTES.QUIZ} element={<Quiz />} />
          <Route path={ROUTES.RESULTS} element={<Results />} />
          <Route path={ROUTES.LEADERBOARD} element={<Leaderboard />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
