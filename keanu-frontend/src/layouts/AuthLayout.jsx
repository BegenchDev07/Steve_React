import { Outlet } from "react-router-dom";
import { Header } from "/src/components/Header";
import KeanuAlert from "/src/components/KeanuAlert";

export default function AuthLayout({ children }){
  return (
    <>
      <Header />
      <KeanuAlert />
      <div className="w-full h-full flex">
        <main className="w-full flex gap-5 application-main">
          <Outlet />
        </main>
      </div>
    </>
  );
};
