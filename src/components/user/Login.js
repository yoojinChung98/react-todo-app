import { Button, Container, Grid, TextField, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { API_BASE_URL as BASE, USER } from '../../config/host-config';
import { redirect, useNavigate } from 'react-router-dom';
import AuthContext from '../../utils/AuthContext';

const Login = () => {
  const redirection = useNavigate();

  const { onLogin } = useContext(AuthContext);

  const REQUEST_URL = BASE + USER + '/signin';

  // 서버에 비동기() 로그인 요청(= AJAX 요청)

  // 함수 앞에 async를 붙이면 해당 함수는 프로미스 객체를 바로 리턴합니다. (async 내부에서만 await 사용 가능)

  const fetchLogin = async () => {
    // async & await 사용
    // 이메일, 비밀번호 입력 태그 얻어오기
    // 사용자의 입력값 상태를 계속 기억하고 있을 필요가 없기 때문에 useState를 사용하지 않음.
    // 따라서 따로 검증할 필요도 없음 (그냥 안맞으면 로그인 안시켜주면 되기 때문)
    // 그리고 이 함수는 요소들이 렌더링 된 후 호출되는 것이 보장되므로 바닐라 사용해서 요소지목할것임
    const $email = document.getElementById('email');
    const $password = document.getElementById('password');

    // await는 async로 선언된 함수에서만 사용이 가능합니다
    // await는 프로미스 객체가 처리될 때까지 기다립니다.
    // 프로미스 객체의 반환값을 바로 활용할 수 있도록 도와줍니다.
    // then()을 활용하는 것보다 가독성이 좋고, 쓰기도 쉽습니다.
    // await 는 순서를 보장해줌. awiat 패치가 끝날 때가지 하단의 코드는 실행을 시작하지 못하게 해줌.
    const res = await fetch(REQUEST_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: $email.value,
        password: $password.value,
      }),
    });

    if (res.status === 400) {
      const text = await res.text();
      alert(text);
      return;
    }

    const { token, userName, email, role } = await res.json(); // 서버에서 온 json 읽기

    // Context API를 사용하여 로그인 상태를 업데이트 합니다.
    onLogin(token, userName, role);

    // 홈으로 리다이렉트
    redirection('/');

    /*
    fetch(REQUEST_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: $email.value,
        passowrd: $password.value,
      }),
    })
      .then((res) => {
        if (res.status === 400) {
          // 가입이 안되어있거나, 비번이 틀린 경우
          return res.text(); // 에러메세지.body(e.getMessage())는 text 형식이기 때문에 text()로 리턴함.
        }
        return res.json(); // 400 에러가 아니라면 로그인 성공이기 때문에 json()을 리턴.
      })
      .then((result) => {
        // 에러가 났다면 result로 에러 텍스트메세지가 올거고, 에러가 안났다면 json 객체가 result로 들어올 것!
        if (typeof reuslt === 'string') {
          // typeof : 데이터타입을 나타내는 문자열을 반환하는 연산자.
          alert(result);
          return;
        }
        console.log(result);
      });
      */
  };

  // 로그인 요청 핸들러
  const loginHandler = (e) => {
    e.preventDefault();

    // 서버에 로그인 요청 전송
    fetchLogin();
  };

  return (
    <Container
      component='main'
      maxWidth='xs'
      style={{ margin: '200px auto' }}
    >
      <Grid
        container
        spacing={2}
      >
        <Grid
          item
          xs={12}
        >
          <Typography
            component='h1'
            variant='h5'
          >
            로그인
          </Typography>
        </Grid>
      </Grid>

      <form
        noValidate
        onSubmit={loginHandler}
      >
        <Grid
          container
          spacing={2}
        >
          <Grid
            item
            xs={12}
          >
            <TextField
              variant='outlined'
              required
              fullWidth
              id='email'
              label='email address'
              name='email'
              autoComplete='email'
            />
          </Grid>
          <Grid
            item
            xs={12}
          >
            <TextField
              variant='outlined'
              required
              fullWidth
              name='password'
              label='on your password'
              type='password'
              id='password'
              autoComplete='current-password'
            />
          </Grid>
          <Grid
            item
            xs={12}
          >
            <Button
              type='submit'
              fullWidth
              variant='contained'
              color='primary'
            >
              로그인
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default Login;
