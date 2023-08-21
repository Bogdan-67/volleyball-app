const pageMotion = {
  hidden: {
    opacity: 0,
    x: -100,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      type: 'spring',
      stiffness: 100,
    },
  },
  exit: {
    opacity: 0,
    x: 100,
    transition: {
      duration: 0.4,
      type: 'spring',
    },
  },
};

export default pageMotion;
