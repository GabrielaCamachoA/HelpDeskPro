"use client";

import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "@/app/components/Providers";
import LangSelector from "./LanguageToggle";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";

function NavBar() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = () => {
    logout();       
    router.push("/login"); // redirige al login
  };

  return (
    <nav className="bg-zinc-900 p-4 text-white">
      <div className="flex justify-between container mx-auto items-center">
        
        <Link href="/">
          <h1 className="font-bold text-xl">HelpDeskPro</h1>
        </Link>

        <ul className="flex gap-x-4 items-center">
          
          {user ? (
            <>
              <li>
                <Button 
                  label="Logout"
                  className="p-button-danger p-button-sm"
                  onClick={handleLogout}
                />
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/login">Login</Link>
              </li>
            </>
          )}
        </ul>

        <LangSelector />
      </div>
    </nav>
  );
}

export default NavBar;
