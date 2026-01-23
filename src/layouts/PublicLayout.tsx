import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import NavBar from "@/components/NavBar";

export default function MainLayout() {
  return (
    <>
      <header className="">
        <Header />
      </header>
      <main>
        <NavBar />
        <Outlet />
      </main>
    </>
  );
}
