import { motion } from 'framer-motion';
import styles from './hamburger.module.scss';
import { Link, useLocation } from 'react-router-dom';
import { pages } from './Navigation';

const variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -200 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};
const colors = ['#03a9f4', '#29b6f6', '#4fc3f7', '#81d4fa', '#40c4ff'];
export const MenuItem = ({ page, setIsOpen }) => {
  const location = useLocation();
  const style = {
    border: `1px solid ${colors[page.data]}`,
  };
  const activePageBack = {
    background: `linear-gradient(45deg, rgba(0, 0, 0, 0) 83%, ${colors[page.data]} 100%)`,
  };

  // Сортируем элементы на основе номера data
  const sortedPages = pages.sort((a, b) => a.data - b.data);
  const isActivePage = location.pathname === page.path;
  const combinedStyle = isActivePage ? { ...style, ...activePageBack } : style;

  return (
    <motion.li
      className={styles.li}
      variants={variants}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}>
      <Link
        onClick={() => setIsOpen(false)}
        to={page.path}
        style={combinedStyle}
        className={isActivePage ? styles.activePage : ''}>
        {page.label} {page.fa}
      </Link>
    </motion.li>
  );
};
