import { Route, Routes } from "react-router-dom";
import Home from "@/pages/public/Home";
import AboutMe from "@/pages/public/AboutMe";
import Contact from "@/pages/public/Contact";
import Members from "@/pages/public/Members";
import Events from "@/pages/public/Events";
import PublicLayout from "@/layouts/PublicLayout";

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
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
