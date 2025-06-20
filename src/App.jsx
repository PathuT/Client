import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import Auth from './components/Auth';
import SubmissionValidator from './components/SubmissionValidator';
import Verification from './components/Verification';
import './styles.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/submission" element={<SubmissionValidator />} />
        <Route path="/verify" element={<Verification />} />
      </Routes>
    </Router>
  );
}

export default App;
