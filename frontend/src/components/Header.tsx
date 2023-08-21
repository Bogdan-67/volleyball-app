import { FC, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/img/Logo_VolleyBall.png';
import Hamburger from './Hamburger';
import { motion } from 'framer-motion';
import { useAppSelector } from '../hooks/redux';
import { SelectUser, SelectUserRole, logoutAccount } from '../redux/slices/profileSlice';
import { MdLogout } from 'react-icons/md';
import { useAppDispatch } from '../redux/store';

const Header: FC = () => {
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const { name, surname, patronimyc } = useAppSelector(SelectUser);
  const role = useAppSelector(SelectUserRole);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isScrolled = scrollPosition > 100;

  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <header
      className={`header `}
      id='header'
      style={{ backgroundColor: isScrolled ? 'transparent' : '#fff' }}>
      <motion.nav className='container'>
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: isScrolled ? 0 : 1 }}
          transition={{ duration: 0.5 }}
          className='header__container'>
          <Link to='/profile' className='header__logo'>
            <img src={logo} alt='logo' width='44px' />
            <div className='header__title'>
              Volley
              <br /> Ball
            </div>
          </Link>
          <div className='header__box'>
            {name && surname && (
              <Link to='/profile' className='header__fio'>
                {surname +
                  ' ' +
                  name.split('')[0].toUpperCase() +
                  '.' +
                  (patronimyc ? ' ' + patronimyc.split('')[0].toUpperCase() + '.' : '')}
              </Link>
            )}
            {role === 'USER' && (
              <motion.div className='header__box__logout' onClick={() => dispatch(logoutAccount())}>
                <MdLogout />
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.nav>
      <motion.div
        initial={{
          position: 'fixed',
          top: '0px',
          width: '100%',
          opacity: 0,
          y: 10,
          pointerEvents: 'none',
        }}
        animate={{
          opacity: isScrolled ? 1 : 0,
          position: 'fixed',
          y: isScrolled ? 0 : -10,
          pointerEvents: isScrolled ? 'auto' : 'none',
        }}
        transition={{ duration: 0.3 }}
        className={isScrolled ? ' header__scrolled' : ''}>
        <div className='container'>
          <div className='header__container'>
            <Link to='/profile' className='header__logo'>
              <motion.img
                animate={{ opacity: isScrolled ? 1 : 0, y: isScrolled ? 0 : 0 }}
                transition={{ duration: 0, delay: 0 }}
                src={logo}
                alt='logo'
                width='44px'
              />
              <div className='header__title'>
                Volley
                <br /> Ball
              </div>
            </Link>
            <div className='header__box'>
              {name && surname && (
                <Link to='/profile' className='header__fio'>
                  {surname +
                    ' ' +
                    name.split('')[0].toUpperCase() +
                    '.' +
                    (patronimyc ? ' ' + patronimyc.split('')[0].toUpperCase() + '.' : '')}
                </Link>
              )}
              {role === 'USER' && (
                <motion.div
                  className='header__box__logout'
                  onClick={() => dispatch(logoutAccount())}>
                  <MdLogout />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
      {role !== 'USER' && role && <Hamburger setIsOpen={setIsOpen} isOpen={isOpen} />}
    </header>
  );
};

export default Header;
