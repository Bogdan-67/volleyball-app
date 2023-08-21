import { FC, useRef } from 'react';
import styles from './Modal.module.scss';
import classNames from 'classnames';
import { FaTimes } from 'react-icons/fa';
import useOnClickOutside from '../../hooks/onClickOutside';

interface ModalProps {
  isActive: boolean;
  setIsActive: (value: boolean) => void;
  children: React.ReactNode;
}

const Modal: FC<ModalProps> = ({ isActive, setIsActive, children }) => {
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => setIsActive(false));

  return (
    <div
      style={{ zIndex: !isActive ? -1 : 999 }}
      className={classNames(styles.action, { [styles.active]: isActive })}>
      <div ref={ref} className={classNames(styles.action__content, { [styles.active]: isActive })}>
        <FaTimes className={styles.action__close} onClick={() => setIsActive(false)} />
        {children}
      </div>
    </div>
  );
};

export default Modal;
