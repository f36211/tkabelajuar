import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Materi from './pages/Materi';
import MateriDetail from './pages/MateriDetail';
import Latihan from './pages/Latihan';
import LatihanSoal from './pages/LatihanSoal';
import SimulasiUjian from './pages/SimulasiUjian';
import HasilUjian from './pages/HasilUjian';
import Progress from './pages/Progress';
import RumusCepat from './pages/RumusCepat';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/materi" element={<Materi />} />
            <Route path="/materi/:topikId" element={<MateriDetail />} />
            <Route path="/latihan" element={<Latihan />} />
            <Route path="/latihan/:topikId" element={<LatihanSoal />} />
            <Route path="/simulasi" element={<SimulasiUjian />} />
            <Route path="/hasil-ujian" element={<HasilUjian />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/rumus" element={<RumusCepat />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
