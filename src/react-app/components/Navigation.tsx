import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { BarChart3, Search, Trophy, Users, Menu, X, Compass } from 'lucide-react';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'My Stats', icon: BarChart3 },
    { path: '/search', label: 'Search', icon: Search },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { path: '/compare', label: 'Compare', icon: Users },
    { path: '/discovery', label: 'Discovery', icon: Compass },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-3 bg-white rounded-full shadow-lg border border-gray-200"
        >
          {isMenuOpen ? (
            <X className="w-5 h-5 text-gray-600" />
          ) : (
            <Menu className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsMenuOpen(false)} />
      )}

      {/* Navigation */}
      <nav className={`
        fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow-lg z-40 transition-transform duration-300 ease-in-out
        w-64 md:translate-x-0 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:static md:w-auto md:h-auto md:bg-transparent md:border-none md:shadow-none
        md:flex md:justify-center md:mt-8
      `}>
        <div className="p-6 md:p-0">
          {/* Logo */}
          <div className="flex items-center space-x-2 mb-8 md:hidden">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              FarScore
            </span>
          </div>

          {/* Navigation items */}
          <div className="space-y-2 md:space-y-0 md:flex md:space-x-1 md:bg-white md:rounded-full md:p-2 md:border md:border-gray-200 md:shadow-lg">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                    md:px-6 md:py-2 md:space-x-2
                    ${active 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg' 
                      : 'text-gray-600 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main content padding for desktop */}
      <div className="md:pl-0" />
    </>
  );
}
