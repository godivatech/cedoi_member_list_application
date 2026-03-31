import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { BusinessForm } from './components/BusinessForm';
import { AdminDashboard } from './components/AdminDashboard';
import { MemberDirectory } from './components/MemberDirectory';
import { ShareProfile } from './components/ShareProfile';
import { Banner } from './components/ui/Banner';
import { LayoutDashboard, PlusCircle, Users } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background-secondary">
        <header className="bg-white border-b border-border sticky top-0 z-30 px-4 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                G
              </div>
              <span className="font-bold text-xl text-text-primary tracking-tight">Godiva Connect</span>
            </Link>

            <nav className="flex items-center gap-4">
              <Link
                to="/directory"
                className="text-text-secondary hover:text-primary transition-colors text-sm font-medium flex items-center gap-1"
              >
                <Users size={16} />
                <span className="hidden sm:inline">Directory</span>
              </Link>
              <Link
                to="/"
                className="text-text-secondary hover:text-primary transition-colors text-sm font-medium flex items-center gap-1"
              >
                <PlusCircle size={16} />
                <span className="hidden sm:inline">Register</span>
              </Link>
              <Link
                to="/admin"
                className="text-text-secondary hover:text-primary transition-colors text-sm font-medium flex items-center gap-1"
              >
                <LayoutDashboard size={16} />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            </nav>
          </div>
        </header>

        <main className="px-4 py-6">
          <div className="max-w-6xl mx-auto">
            <Routes>
              <Route path="/" element={
                <div className="space-y-12">
                  <Banner 
                    imageSrc="/assets/banners/1.jpeg" 
                    altText="Godiva Connect Banner"
                  />
                  <BusinessForm />
                </div>
              } />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/directory" element={<MemberDirectory />} />
              <Route path="/share/:id" element={<ShareProfile />} />
            </Routes>
          </div>
        </main>

        <footer className="max-w-xl mx-auto px-4 py-8 text-center pb-32">
          <p className="text-text-secondary text-sm">
            &copy; {new Date().getFullYear()} Godiva Connect App.
          </p>
          <div className="mt-2 text-xs font-medium text-text-secondary tracking-wide">
            DESIGNED AND DEVELOPED BY{' '}
            <a
              href="https://godivatech.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-bold"
            >
              GODIVA TECH
            </a>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App