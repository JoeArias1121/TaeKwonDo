import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import NavBar from "@/components/NavBar";

export default function MainLayout() {
  return (
    <>
      <header className="flex w-full">
        <Header />
      </header>
      <main className="flex flex-col items-center">
        <div className="flex flex-col items-center justify-center w-11/12 md:w-3/4 xl:w-1/2">
          <NavBar />
          <Outlet />
        </div>
      </main>
    </>
  );
}
