import { AppBar, Grid, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom'; // 리액트라우터돔에서 제공하는 컴포넌트 Link
import './Header.scss';

// mui material 도 부트스트랩 같은 미리 만들어진 디자인을 사용하는 것!
const Header = () => {
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
              <Typography variant='h4'>오늘의 할일</Typography>
            </div>
          </Grid>

          <Grid item>
            <div className='btn-group'>
              {/* 화면상 표현은 a 태그로 잡히지만, a태그가 실제로 동작하는 것은 아님 
              Link 를 누르면 Router 가 반응하고, 라우터가 해당 url을 해석하여 필요한 컴포넌트를 재렌더링을 함(<Route>).*/}
              <Link to='/login'>로그인</Link>
              <Link to='/join'>회원가입</Link>
            </div>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
