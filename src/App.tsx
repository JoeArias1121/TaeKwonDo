import { Route, Routes } from "react-router-dom";
import Home from "@/pages/public/Home";
import AboutMe from "@/pages/public/AboutMe";
import Contact from "@/pages/public/Contact";
import Members from "@/pages/public/Members";
import Events from "@/pages/public/Events";
import PublicLayout from "@/layouts/PublicLayout";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import PendingApproval from "@/pages/auth/PendingApproval";
import Dashboard from "@/pages/admin/Dashboard";
import EventsManager from "@/pages/admin/EventsManager";
import MembersManager from "@/pages/admin/MembersManager";
import AboutEditor from "@/pages/admin/AboutEditor";
import Approvals from "@/pages/admin/Approvals";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayout from "@/layouts/AdminLayout";

function App() {
  return (
    <>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/aboutme" element={<AboutMe />} />
          <Route path="/events" element={<Events />} />
          <Route path="/members" element={<Members />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Standalone Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/pending-approval" element={<PendingApproval />} />

        {/* Protected Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requireApproval={true}>
              <AdminLayout />
            </ProtectedRoute>
          } 
        >
          <Route index element={<Dashboard />} />
          <Route path="events" element={<EventsManager />} />
          <Route path="members" element={<MembersManager />} />
          <Route path="about" element={<AboutEditor />} />
          <Route path="approvals" element={<Approvals />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
