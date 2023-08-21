import { FC, useEffect, useRef } from 'react';
import styles from './footer.module.scss';

const Footer = ({ setBlockHeight }) => {
  //const [blockHeight, setBlockHeight] = useState(0);
  const blockRef = useRef(null);

  useEffect(() => {
    const updateHeight = () => {
      if (blockRef.current) {
        const height = blockRef.current.getBoundingClientRect().height + 'px';
        setBlockHeight(height);
      }
    };

    window.addEventListener('resize', updateHeight);
    updateHeight();
    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  return (
    <div className={styles.footer} ref={blockRef}>
      {/* {blockHeight} */}
      <nav className='container'>
        <ul className={styles.footer__body}>
          <div className={styles.footer__block}>
            <h1 className={styles.footer__title}>
              <a href='https://www.miet.ru/' target='MIET' className={styles.footer__title}>
                МИЭТ
              </a>
            </h1>
            <div className={styles.footer__blockText}>
              <a
                className={styles.footer__text}
                href='https://yandex.ru/maps/org/moskovskiy_institut_elektronnoy_tekhniki/1042223652/?ll=37.208453%2C55.983384&z=17.08'
                target='MIET'>
                площадь Шокина, 1
              </a>
              <a
                className={styles.footer__text}
                href='https://vk.com/sport.miet'
                target='VK_Electron'>
                ССК «Электрон»
              </a>
            </div>
          </div>
          <div className={styles.footer__teacher}>
            <h1 className={styles.footer__title}>Преподаватель</h1>
            <p className={styles.footer__text}>Борисова Наталья Юрьевна</p>
            <a href='mailto:n.y.borisova@mail.ru' className={styles.footer__text}>
              n.y.borisova@mail.ru
            </a>
          </div>
          <div className={styles.footer__dev}>
            <h1 className={styles.footer__title}>Разработано командой:</h1>
            <p className={styles.footer__text}>
              <a href='https://github.com/KKuhta' target='GitHub Kirill'>
                Кирилл
              </a>
              ,{' '}
              <a href='https://github.com/RaKeD1' target='GitHub Danila'>
                Данила
              </a>
              ,{' '}
              <a href='https://github.com/Bogdan-67' target='GitHub Bogdan'>
                Богдан
              </a>
            </p>
            <p className={styles.footer__text}>© {String(new Date().getFullYear())}</p>
          </div>
        </ul>
      </nav>
    </div>
  );
};
export const blockHeight = {
  value: 0,
  updateHeight: function () {
    const element = document.querySelector('#yourBlockId');
    if (element) {
      this.value = (element as HTMLElement).offsetHeight;
    }
  },
};
//export const blockHeight = blockHeight;
export default Footer;
