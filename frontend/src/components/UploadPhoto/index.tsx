import { useState } from 'react';
import styles from './UploadPhoto.module.scss';
import DropzoneComponent from '../DropzoneComponent';
import { useSelector } from 'react-redux';
import { SelectUser, setImg } from '../../redux/slices/profileSlice';
import UserService from '../../services/UserService';
import { useAppDispatch } from '../../hooks/redux';
import { AnimatePresence, motion } from 'framer-motion';

const UploadPhoto = ({ onSend }) => {
  const { id_user } = useSelector(SelectUser);
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string>(null);

  const sendImage = async (file) => {
    const formData = new FormData();
    formData.append('id', `${id_user}`);
    formData.append('img', file);
    await UserService.updateUserPhoto(formData)
      .then((res) => {
        onSend(false);
        setError(null);
        dispatch(setImg(res.data));
      })
      .catch((err) => {
        setError(
          err.response.data.message ? err.response.data.message : 'Не удалось отправить фото',
        );
      });
  };

  const errVariants = {
    hidden: {
      height: 0,
    },
    visible: {
      height: 'initial',
    },
  };

  return (
    <div className={styles.root}>
      <h2 className={styles.root__title}>Загрузка фото</h2>
      <AnimatePresence>
        {error && (
          <motion.div
            variants={errVariants}
            initial='hidden'
            animate='visible'
            exit='hidden'
            className={styles.root__error}>
            {error}
          </motion.div>
        )}
      </AnimatePresence>
      <DropzoneComponent onPhotoUpload={(file) => sendImage(file)} />
    </div>
  );
};

export default UploadPhoto;
