import { AppBar, Grid, Toolbar, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 리액트라우터돔에서 제공하는 컴포넌트 Link
import './Header.scss';
import { isLogin } from '../../utils/login-util';
import { getLoginUserInfo } from '../../utils/login-util';
import AuthContext from '../../utils/AuthContext';

// mui material 도 부트스트랩 같은 미리 만들어진 디자인을 사용하는 것!
const Header = () => {
  const redirection = useNavigate();

  // AuthContext에서 로그인 상태를 가져옵니다.
  const { isLoggedIn, userName, onLogout } = useContext(AuthContext);

  // 로그아웃 핸들러
  const logoutHandler = () => {
    // AuthContext의 onLogout 함수를 호출하여 로그인 상태를 업데이트 합니다.
    onLogout();
    redirection('/login'); // 위에서 선언한 useNavigate()를 사용하는 것. 입력한 값에 따라 Router 가 반응@!
  };

  return (
    <AppBar
      position='fixed'
      style={{
        background: '#38d9a9',
        width: '100%',
      }}
    >
      <Toolbar>
        <Grid
          justify='space-between'
          container
        >
          <Grid
            item
            flex={9}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography variant='h4'>
                {isLoggedIn ? userName + '님' : '오늘'}의 할일
              </Typography>
            </div>
          </Grid>

          <Grid item>
            <div className='btn-group'>
              {isLoggedIn ? (
                <button
                  className='logout-btn'
                  onClick={logoutHandler}
                >
                  로그아웃
                </button>
              ) : (
                <>
                  <Link to='/login'>로그인</Link>
                  <Link to='/join'>회원가입</Link>
                </>
              )}
            </div>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
