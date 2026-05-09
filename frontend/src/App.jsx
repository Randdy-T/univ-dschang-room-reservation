import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import TeacherHome from './pages/teacher/TeacherHome';
import SearchRooms from './pages/teacher/SearchRooms';
import ImportStudents from './pages/admin/ImportStudents';
import StudentHome from './pages/student/StudentHome';

function App() {
  // 1. Définition des menus par rôle
  const teacherMenu = [
    { label: "Tableau de Bord", path: "/teacher" },
    { label: "Réserver une Salle", path: "/teacher/reserve" },
    { label: "Mes Réservations", path: "/teacher/my-bookings" },
  ];

  const studentMenu = [
    { label: "Mon Emploi du Temps", path: "/student" },
    { label: "Notifications", path: "/student/notifs" },
  ];

  const adminMenu = [
    { label: "Gestion Campus", path: "/admin" },
    { label: "Gestion des Salles", path: "/admin/rooms" },
    { label: "Import Étudiants (Excel)", path: "/admin/import" },
    { label: "Utilisateurs", path: "/admin/users" },
  ];

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* ESPACE ENSEIGNANT */}
        <Route path="/teacher" element={<DashboardLayout role="ENSEIGNANT" menuItems={teacherMenu} />}>
          <Route index element={<TeacherHome />} />
          <Route path="reserve" element={<SearchRooms />} />
        </Route>

        {/* ESPACE ÉTUDIANT */}
        <Route path="/student" element={<DashboardLayout role="ETUDIANT" menuItems={studentMenu} />}>
          <Route index element={<StudentHome />} />
        </Route>

        {/* ESPACE ADMIN */}
        <Route path="/admin" element={<DashboardLayout role="ADMIN" menuItems={adminMenu} />}>
          <Route index element={
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">Console d'Administration</h1>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-10 bg-univ-blue text-white rounded-xl">Statistiques Globales</div>
                <div className="p-10 bg-univ-green text-white rounded-xl">État des Serveurs</div>
              </div>
            </div>
          } />
          <Route path="import" element={<ImportStudents />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;