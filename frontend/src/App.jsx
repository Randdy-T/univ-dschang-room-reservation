import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

// Enseignant
import TeacherHome from './pages/teacher/TeacherHome';
import SearchRooms from './pages/teacher/SearchRooms';
import ReserveRoom from './pages/teacher/ReserveRoom';
import MyBookings from './pages/teacher/MyBookings';

// Étudiant
import StudentHome from './pages/student/StudentHome';
import Schedule from './pages/student/Schedule';
import Notifications from './pages/student/Notifications';

// Admin
import AdminHome from './pages/admin/AdminHome';
import CampusManagement from './pages/admin/CampusManagement';
import RoomsManagement from './pages/admin/RoomsManagement';
import ImportStudents from './pages/admin/ImportStudents';
import UsersManagement from './pages/admin/UsersManagement';
import AcademicStructure from './pages/admin/AcademicStructure';
import ReservationsManagement from './pages/admin/ReservationsManagement';

// Doyen / Chef de département
import DeanHome from './pages/dean/DeanHome';
import ExamScheduling from './pages/dean/ExamScheduling';
import DeanPlanning from './pages/dean/DeanPlanning';

function App() {
  return (
    <Router>
      <Routes>

        {/* Page publique */}
        <Route path="/" element={<Login />} />

        {/* ESPACE ENSEIGNANT */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={['TEACHER']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<TeacherHome />} />
          <Route path="search" element={<SearchRooms />} />
          <Route path="reserve" element={<ReserveRoom />} />
          <Route path="my-bookings" element={<MyBookings />} />
        </Route>

        {/* ESPACE ÉTUDIANT */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={['ETUDIANT']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentHome />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        {/* ESPACE ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminHome />} />
          <Route path="campus" element={<CampusManagement />} />
          <Route path="rooms" element={<RoomsManagement />} />
          <Route path="import" element={<ImportStudents />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="reservations" element={<ReservationsManagement />} />
          <Route path="academic" element={<AcademicStructure />} />
        </Route>

        {/* ESPACE CHEF DE DÉPARTEMENT / DOYEN */}
        <Route
          path="/dean"
          element={
            <ProtectedRoute allowedRoles={['HEAD_OF_DEPT']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DeanHome />} />
          <Route path="exam" element={<ExamScheduling />} />
          <Route path="planning" element={<DeanPlanning />} />
        </Route>

        {/* PAGE 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}

export default App;