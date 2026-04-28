import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import NavBar from "@/components/NavBar";

export default function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <Header />
      <NavBar />
      {/* Container spacing remains natural since NavBar is sticky */}
      <main className="flex-grow w-full flex flex-col pt-0">
        <div className="flex-grow flex flex-col w-full h-full">
          <Outlet />
        </div>
      </main>
      <footer className="w-full bg-card border-t py-8 mt-auto">
        <div className="container mx-auto px-6 text-center text-muted-foreground text-sm">
        </div>
      </footer>
    </div>
  );
}
