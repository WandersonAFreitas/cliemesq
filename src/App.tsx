import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PatientWelcomeContainer } from './components/PatientWelcome/PatientWelcomeContainer';
import { AdminDashboard } from './components/Admin/AdminDashboard';

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/acolhimento" element={
          <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <PatientWelcomeContainer />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
