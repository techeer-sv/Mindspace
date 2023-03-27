import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import NodeMap from './pages/NodeMap';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/map" element={<NodeMap />} />
      </Routes>
    </Router>
  );
}

export default App;
