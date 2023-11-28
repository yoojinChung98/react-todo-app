import React from 'react';
import TodoTemplate from './components/todo/TodoTemplate';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { Route, Routes } from 'react-router-dom';
import Login from './components/user/Login';
import Join from './components/user/Join';
import { AuthContextProvider } from './utils/AuthContext';

const App = () => {
  return (
    // 전달하고자 하는 데이터를 가진 자식 컴포넌트를 Provider 로 감싸야 얘네들이 Consumer 가 될 수 있음.
    <AuthContextProvider>
      <div className='wrapper'>
        <Header />

        <div className='content-wrapper'>
          <Routes>
            {/* 라우트 하나당 링크 하나! */}
            <Route
              path='/'
              element={<TodoTemplate />}
            />
            <Route
              path='/login'
              element={<Login />}
            />
            <Route
              path='/join'
              element={<Join />}
            />
          </Routes>
        </div>

        <Footer />
      </div>
    </AuthContextProvider>
  );
};

export default App;
