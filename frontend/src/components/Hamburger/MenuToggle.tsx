import { motion, useAnimation } from 'framer-motion';
import * as React from 'react';
import styles from './hamburger.module.scss';

const Path = (props) => (
  <motion.path
    fill='transparent'
    strokeWidth='3'
    stroke='hsl(0, 0%, 18%)'
    strokeLinecap='round'
    {...props}
  />
);

const side = {
  open: {
    d: 'M 3 16.5 L 17 2.5',
    transition: {
      delay: 0.1,
    },
  },
  closed: {
    d: 'M 2 2.5 L 20 2.5',
    transition: {
      delay: 0.1,
    },
  },
};
const side2 = {
  open: {
    d: 'M 3 2.5 L 17 16.346',
    transition: {
      delay: 0.05,
    },
  },
  closed: {
    d: 'M 2 16.346 L 20 16.346',
    transition: {
      delay: 0.05,
    },
  },
};

export const MenuToggle = (props) => {
  const closeFirst = 'M 2 2.5 L 20 2.5';
  const closeSecond = 'M 2 16.346 L 20 16.346';
  const openFirst = 'M 3 16.5 L 17 2.5';
  const openSecond = 'M 3 2.5 L 17 16.346';

  const controls = useAnimation();

  React.useEffect(() => {
    controls.start(props.isOpen ? 'open' : 'closed');
  }, [props.isOpen, controls]);

  return (
    <div className={styles.button} onClick={props.toggle}>
      <svg width='23' height='23' viewBox='0 0 23 23'>
        <Path d={props.isOpen ? openFirst : closeFirst} animate={controls} variants={side} />
        <Path
          d='M 2 9.423 L 20 9.423'
          variants={{
            closed: { opacity: 1 },
            open: { opacity: 0 },
          }}
          animate={controls}
        />
        <Path d={props.isOpen ? openSecond : closeSecond} animate={controls} variants={side2} />
      </svg>
    </div>
  );
};
