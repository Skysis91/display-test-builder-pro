
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ImageIcon, FileText, Eye } from "lucide-react";

const Index = () => {
  const { user, isLoading } = useAuth();

  // If user is logged in, redirect to dashboard
  if (user && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-xl text-brand-700">Display Test Platform</span>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="sm">Log in</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 py-12 md:py-24 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-8">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Test Display Ads with Ease
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Quickly build static HTML pages containing display creatives with tracking tags for manual testing and verification.
            </p>
            <div className="space-x-4">
              <Link to="/login">
                <Button className="bg-brand-600 hover:bg-brand-700 px-6 py-6" size="lg">
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  Log In
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="bg-white p-6 rounded-lg shadow-xl border">
              <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center mb-4">
                <ImageIcon className="h-20 w-20 text-gray-300" />
              </div>
              <div className="space-y-3">
                <div className="h-6 bg-gray-100 rounded w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                <div className="flex space-x-2">
                  <div className="h-8 bg-brand-100 rounded w-24"></div>
                  <div className="h-8 bg-gray-100 rounded w-24"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              Key Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-brand-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="h-8 w-8 text-brand-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy File Upload</h3>
                <p className="text-gray-600">
                  Drag & drop multiple image files with preview and automatic size detection.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-brand-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-brand-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Tracking URLs</h3>
                <p className="text-gray-600">
                  Configure click and impression URLs for each creative or use global settings.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-brand-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-8 w-8 text-brand-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">HTML Generation</h3>
                <p className="text-gray-600">
                  Automatically create HTML test pages with proper tracking implementation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h3 className="text-xl font-bold mb-4">Display Test Platform</h3>
              <p className="text-gray-400 max-w-md">
                A tool for marketers to quickly test display ads and verify tracking.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Get Started</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/login" className="text-gray-400 hover:text-white transition-colors">
                    Log In
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-gray-400 hover:text-white transition-colors">
                    Create Account
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} Display Test Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
