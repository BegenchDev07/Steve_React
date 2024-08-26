import { Outlet } from "react-router-dom";
import { Header } from "/src/components/Header";
import KeanuAlert from "/src/components/KeanuAlert";

export default function VisitorsLayout({ children }){
  return (
    <>
      <Header />
      <KeanuAlert />
      <div className="flex">
        <main className="application-main flex-1 mt-16 ml-40 bg-gray-100 p-6">
            <Outlet />
        </main>
      </div>
    </>
  );
};
