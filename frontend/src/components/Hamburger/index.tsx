import { useRef } from 'react';
import { motion } from 'framer-motion';
import { MenuToggle } from './MenuToggle';
import { Navigation } from './Navigation';
import styles from './hamburger.module.scss';
import useOnClickOutside from '../../hooks/onClickOutside';

const sidebar = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 100px 100px)`,
    visability: 'visible',
    backgroundColor: '#fff',
    transition: {
      type: 'spring',
      stiffness: 20,
      restDelta: -1,
    },
  }),
  closed: {
    clipPath: 'circle(0px at 500px 0px)',
    visability: 'hidden',
    backgroundColor: '#fff',
    transition: {
      delay: 0.05,
      type: 'spring',
      stiffness: 300,
      damping: 40,
    },
  },
};

const Hamburger = ({ setIsOpen, isOpen }) => {
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => setIsOpen(false));

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {isOpen && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}></motion.div>
      )}
      <motion.div ref={ref}>
        <MenuToggle isOpen={isOpen} toggle={toggleOpen} />
        <motion.nav
          className={styles.nav}
          initial={false}
          variants={sidebar}
          animate={isOpen ? 'open' : 'closed'}>
          <motion.div className={styles.background} variants={sidebar} />
          <Navigation setIsOpen={setIsOpen} />
        </motion.nav>
      </motion.div>
    </>
  );
};
export default Hamburger;
