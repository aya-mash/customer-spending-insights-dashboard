import { useState } from 'react';
import { Navigation } from '../navigation/Navigation';
import { useKeyboardNavigation } from '../utils/navigation';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isKeyboardUser } = useKeyboardNavigation();

  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      href: '/',
      icon: '📊'
    },
    {
      id: 'insights',
      label: 'Insights',
      href: '/insights',
      icon: '💡'
    },
    {
      id: 'transactions',
      label: 'Transactions',
      href: '/transactions',
      icon: '💳'
    }
  ];

  return (
    <div className={`app-layout ${isKeyboardUser ? 'keyboard-user' : ''}`}>
      <Navigation 
        items={navItems}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        isMenuOpen={isMenuOpen}
      />
      
      <main 
        className={`main-content ${isMenuOpen ? 'main-content--with-sidebar' : 'main-content--collapsed'}`}
        role="main"
      >
        <div className="main-content__inner">
          {children}
        </div>
      </main>
    </div>
  );
}