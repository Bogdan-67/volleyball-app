import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './scss/app.scss';
import Header from './components/Header';
import Login from './pages/Login';
import Registr from './pages/Registr';
import Profile from './pages/Profile';
import TrainingEdit from './pages/TrainingEdit';
import React, { useState } from 'react';
import { RootState, useAppDispatch } from './redux/store';
import { SelectUserRole, checkAuth } from './redux/slices/profileSlice';
import { useSelector } from 'react-redux';
import { Status } from './redux/slices/profileSlice';
import CreateTrain from './components/CreateTrain';
import Players from './pages/Players';
import NotFound from './pages/NotFound/NotFound';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import Statistics from './pages/Statistics';
import Footer from './components/Footer';
import { AnimatePresence, motion } from 'framer-motion';
import pageMotion from './components/pageMotion';
import UserTraining from './pages/UserTraining';

function App() {
  const dispatch = useAppDispatch();
  const status = useSelector((state: RootState) => state.profile.status);
  const isAuth = useSelector((state: RootState) => state.profile.isAuth);
  const location = useLocation();
  const [blockHeight, setBlockHeight] = useState(0);
  console.log(blockHeight);

  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(checkAuth());
    }
  }, []);

  if (status === Status.LOADING) return <LoadingSpinner />;

  return (
    <>
      <div className='page' style={{ minHeight: `calc(100vh - ${blockHeight})` }}>
        {isAuth && <Header />}
        <div className='container'>
          <div className='content'>
            <AnimatePresence mode='wait'>
              <Routes location={location} key={location.pathname}>
                <Route
                  path='/login'
                  element={
                    <RequireNotAuth redirectTo='/'>
                      <Login />
                    </RequireNotAuth>
                  }></Route>
                <Route
                  path='/registration'
                  element={
                    <RequireNotAuth redirectTo='/'>
                      <Registr />
                    </RequireNotAuth>
                  }></Route>
                <Route
                  path='/'
                  element={
                    <RequireAuth redirectTo='/login'>
                      <Profile />
                    </RequireAuth>
                  }></Route>
                <Route
                  path='/profile'
                  element={
                    <RequireAuth redirectTo='/login'>
                      <Profile />
                    </RequireAuth>
                  }></Route>
                <Route
                  path='/my-training'
                  element={
                    <RequireAuth redirectTo='/login'>
                      <UserTraining />
                    </RequireAuth>
                  }></Route>
                <Route
                  path='/createtraining'
                  element={
                    <RequireAuth redirectTo='/login'>
                      <RequireEditor redirectTo='/profile'>
                        <CreateTrain />
                      </RequireEditor>
                    </RequireAuth>
                  }></Route>
                <Route
                  path='/training'
                  element={
                    <RequireAuth redirectTo='/login'>
                      <RequireEditor redirectTo='/profile'>
                        <TrainingEdit />
                      </RequireEditor>
                    </RequireAuth>
                  }></Route>
                <Route
                  path='/statistics'
                  element={
                    <RequireAuth redirectTo='/login'>
                      <RequireEditor redirectTo='/profile'>
                        <Statistics />
                      </RequireEditor>
                    </RequireAuth>
                  }></Route>
                <Route
                  path='/players'
                  element={
                    <RequireAuth redirectTo='/login'>
                      <RequireAdmin redirectTo='/profile'>
                        <Players />
                      </RequireAdmin>
                    </RequireAuth>
                  }></Route>
                <Route path='*' element={<NotFound />}></Route>
              </Routes>
            </AnimatePresence>
          </div>
        </div>
      </div>
      {isAuth && <Footer setBlockHeight={setBlockHeight} />}
    </>
  );
}

function RequireAuth({ children, redirectTo }) {
  const isAuth = useSelector((state: RootState) => state.profile.isAuth);
  console.log('isAuth', isAuth);
  return isAuth ? children : <Navigate to={redirectTo} />;
}

function RequireNotAuth({ children, redirectTo }) {
  const isAuth = useSelector((state: RootState) => state.profile.isAuth);
  console.log('isAuth', isAuth);
  return !isAuth ? children : <Navigate to={redirectTo} />;
}

function RequireEditor({ children, redirectTo }) {
  const role = localStorage.getItem('role');
  console.log('role', role);
  if (role !== 'EDITOR' && role !== 'ADMIN') alert('Нет прав доступа!');
  return role === 'EDITOR' || role === 'ADMIN' ? children : <Navigate to={redirectTo} />;
}

function RequireAdmin({ children, redirectTo }) {
  const role = localStorage.getItem('role');
  console.log('role', role);
  if (role !== 'ADMIN') alert('Нет прав доступа!');
  return role === 'ADMIN' ? children : <Navigate to={redirectTo} />;
}

export default App;
