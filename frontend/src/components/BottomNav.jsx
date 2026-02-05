import { Link, useLocation } from 'react-router-dom';
import { theme } from '../styles/theme.js';

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/upload', label: 'Upload' },
    { path: '/wardrobe', label: 'Wardrobe' },
    { path: '/profile', label: 'Profile' },
  ];

  const navStyles = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.surfaceColor,
    borderTop: `1px solid ${theme.borderColor}`,
    display: 'flex',
    justifyContent: 'space-around',
    padding: '12px 0',
    zIndex: 1000,
  };

  const navItemStyles = {
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    padding: '8px',
    transition: 'all 0.2s ease',
  };

  const labelStyles = (isActive) => ({
    fontSize: '12px',
    fontWeight: isActive ? '600' : '400',
    color: isActive ? theme.accentColor : theme.secondaryTextColor,
    fontFamily: 'Inter, sans-serif',
  });

  return (
    <nav style={navStyles}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            style={navItemStyles}
          >
            <span style={labelStyles(isActive)}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
