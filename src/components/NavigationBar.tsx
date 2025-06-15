
import { Link, useLocation } from "react-router-dom";
import { Navigation2 as HomeIcon, Navigation as ImagingIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  {
    label: "Home",
    path: "/",
    icon: HomeIcon,
  },
  {
    label: "Imaging",
    path: "/imaging",
    icon: ImagingIcon,
  },
];

const NavigationBar = () => {
  const location = useLocation();
  return (
    <nav className="w-full bg-black/50 border-b border-white/10 px-2 xs:px-3 md:px-4 py-2 fixed top-0 left-0 z-40 flex items-center justify-between backdrop-blur-lg">
      <div className="flex items-center gap-3">
        <span className="font-semibold text-white text-lg xs:text-xl tracking-tight pl-1">Prompt Guru</span>
      </div>
      <div className="flex gap-2 xs:gap-3">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg transition hover:bg-purple-700/80 hover:text-white text-base font-medium",
                isActive
                  ? "bg-purple-700/90 text-white font-bold shadow"
                  : "text-gray-200 hover:text-white"
              )}
              style={{ touchAction: "manipulation" }}
              aria-current={isActive ? "page" : undefined}
            >
              <link.icon className="w-5 h-5 mr-1 xs:mr-2" />
              <span className="hidden xs:inline">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default NavigationBar;

