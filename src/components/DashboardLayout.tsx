
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  ImageIcon, 
  LogOut, 
  Settings, 
  FileText
} from "lucide-react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FileText className="h-5 w-5" />
    },
    {
      name: "New Test",
      path: "/create",
      icon: <ImageIcon className="h-5 w-5" />
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings className="h-5 w-5" />
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="font-bold text-xl text-brand-700">Display Test</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Logged in as <span className="font-medium">{user?.username}</span>
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="flex items-center gap-1"
            >
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 container mx-auto px-4 py-6">
        <aside className="hidden md:block w-56 mr-8">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "bg-brand-50 text-brand-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
        </aside>
        
        <main className="flex-1">
          {children}
        </main>
      </div>
      
      <footer className="mt-auto py-4 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Display Test Platform
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
