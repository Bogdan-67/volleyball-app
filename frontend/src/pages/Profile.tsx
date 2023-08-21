import { FC, useEffect, useRef, useState } from 'react';
import '../scss/profile.scss';
import { SelectUser } from '../redux/slices/profileSlice';
import { useAppDispatch } from '../redux/store';
import { useAppSelector } from '../hooks/redux';
import UpdateUser from '../components/UpdateDataUser';
import ProfileInfo from '../components/ProfileInfo';
import Modal from '../components/Modal';
import UserStatCircles from '../components/UserStatCircles';
import UploadPhoto from '../components/UploadPhoto';
import UserTrainings from '../components/UserTrainings';
import { motion } from 'framer-motion';
import pageMotion from '../components/pageMotion';

export const Profile: FC = () => {
  const avatarSmall = false;
  const user = useAppSelector(SelectUser);
  console.log('user', user);
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [changePhotoModal, setChangePhotoModal] = useState<boolean>(false);

  const handleEdit = () => {
    setShowModal(true);
  };

  return (
    <motion.div variants={pageMotion} initial='hidden' animate='show' exit='exit'>
      <div className='tiles'>
        <ProfileInfo
          deleteBtn={false}
          data={user}
          avatarSmall={avatarSmall}
          inRow={true}
          roleBtn={false}
          onClickEdit={() => handleEdit()}
          onClickEditPhoto={setChangePhotoModal}
        />
        <UserStatCircles user={user.id_account} />
      </div>
      <UserTrainings />
      <Modal isActive={showModal} setIsActive={setShowModal}>
        <UpdateUser user={user} setIsActive={setShowModal} />
      </Modal>
      <Modal isActive={changePhotoModal} setIsActive={setChangePhotoModal}>
        <UploadPhoto onSend={setChangePhotoModal} />
      </Modal>
    </motion.div>
  );
};
export default Profile;
