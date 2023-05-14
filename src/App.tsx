import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import NodeMap from './pages/NodeMap';
import SignInPage from './pages/Auth/SignInPage/index';
import SignUpPage from './pages/Auth/SignUpPage/index';
import AuthRoute from 'components/AuthRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />

        <Route element={<AuthRoute needLogin={true} />}>
          <Route path="/map" element={<NodeMap />} />
        </Route>

        <Route element={<AuthRoute needLogin={false} />}>
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
