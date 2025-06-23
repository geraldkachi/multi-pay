"use client"
import { ReactNode } from 'react'
import { Outlet } from 'react-router-dom';
import Sidebar from '../sidebar';
// import Sidebar from '@/components/Sidebar'
// import { useRouter } from 'next/navigation';
// import { getAdminDetails } from '@/utils/shared';

const links = [
    { name: "Purchases", icon: "/active-purchase.svg", path: "/" },
    { name: "Saved cards/bank", icon:"/saved-cards.svg", path: "/profile" },
    { name: "Settings", icon: "/settings-side.svg", path: "/settings" },
  ];
  interface AppLayoutProps {
  children: ReactNode;
  // showProgress?: boolean;
}
const AuthWarp = ({children}: AppLayoutProps) => {
  // const router = useNavigate()

  return (
    <div className="flex">
    <Sidebar links={links} />
    <main className="flex-1 bg-white p-3 sm:p-6">
      <div className="max-w-full mx-auto">
            <Outlet />
            {children}
      </div>
    </main>
  </div>
  )
}

export default AuthWarp