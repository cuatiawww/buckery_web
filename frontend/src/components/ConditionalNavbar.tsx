"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

const ConditionalNavbar = () => {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');
  
  if (isAdminRoute) return null;
  return <Navbar />;
}

export default ConditionalNavbar;
