import {
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { isValidDateValue } from '@testing-library/user-event/dist/utils';
import React, { useState } from 'react';
import { API_BASE_URL as BASE, USER } from '../../config/host-config';
import { useNavigate } from 'react-router-dom';

const Join = () => {
  // 리다이렉트 사용하기 (리액트에서)
  // 사실 리액트에서는 리디렉션이라는 개념이 없음! 그래서 여기에 입력하는 값에 따라 라우터가 반응하게 됨
  const redirection = useNavigate();

  // 하단의 주소로 fetch 요청 보낼것임!
  const API_BASE_URL = BASE + USER;

  // 상태변수로 회원가입 입력값 관리
  const [userValue, setUserValue] = useState({
    userName: '',
    password: '',
    email: '',
  });

  // 검증 메세지에 대한 상태변수 관리 (백엔드로 보내줄 데이터도 아니기 때문에 그냥 따로 관리하겠음~)
  // 입력값과 메세지는 따로 상태관리(메세지는 백엔드로 보내줄 필요 없음!)
  // 메세지 영역이 각 입력창마다 있기 때문에 객체를 활용해서 한 번에 관리할거야!
  const [message, setMessage] = useState({
    userName: '',
    password: '',
    passwordCheck: '',
    email: '',
  });

  // 검증 완료 체크(결과)에 대한 상태변수 관리
  // 각각의 입력창마다 검증 상태를 관리해야 하기 때문에 객체로 선언.
  // 상태를 유지하려는 이유 -> 마지막에 회원 가입 버튼을 누를 때까지 검증 상태를 유지해야 하기 때문.
  const [correct, setCorrect] = useState({
    userName: false,
    password: false,
    passwordCheck: false,
    email: false,
  });

  // 검증된 데이터를 각각의 상태변수에 저장해주는 함수. (리듀서를 사용하면 더욱,, 간단해질것,, key부분이 타입으로 구분될 것이니까!)
  const saveInputState = ({ key, inputValue, flag, msg }) => {
    // key 값에 따라 상태변수의 값들을 세팅해줄 것임!

    // 사용자 입력값 세팅
    // 패스워드 확인 입력값은 굳이 userValue 상태로 유지할 필요가 없기 때문에
    // 임의의 문자열 'pass'를 넘기고 있습니다. -> pass가 넘어온다면 setUserValue()를 실행하지 않겠다.
    inputValue !== 'pass' && // 비밀번호 확인해서 'pass' 값을 받지 못했다면(비밀번호가 다르다면) 뒤의 setUserValue는 하지 않겠다는 뜻.
      setUserValue((oldVal) => {
        return { ...oldVal, [key]: inputValue };
      });

    // 메세지 세팅
    setMessage((oldMsg) => {
      return { ...oldMsg, [key]: msg }; // 대괄호 = key 변수의 값을 프로퍼티 이름으로 활용할 수 있게 해줌.
    });

    // 입력값 검증 상태 세팅
    setCorrect((oldCorrect) => {
      return { ...oldCorrect, [key]: flag };
    });
  };

  // 이름 입력창 체인지 이벤트 핸들러
  const nameHandler = (e) => {
    const nameRegex = /^[가-힣]{2,5}$/; // Regex = 레귤러익잼플! /^-----$/ 허용할문자범위[가부터힣] 길이제한{2부터5}
    const inputValue = e.target.value;

    // 입력값 검증
    let msg; // 검증 메세지를 저장할 변수
    let flag = false; // 입력값 검증 여부 체크 변수 (이 값이 true로 변해야 검증이 완료된 것!)

    if (!inputValue) {
      // inputValue가 비어있다면! (undefined null NaN '' 모두 false로 해석됨.)
      msg = '유저 이름은 필수입니다.';
    } else if (!nameRegex.test(inputValue)) {
      // test는 자바스크립트에서 제공하는 메서드 ('inputValue'를 nameRegex로 테스트해보겠습니다~)
      // 정규표현식을 통과하지 못했다면~
      msg = '2~5글자 사이의 한글로 작성하세요!';
    } else {
      msg = '사용 가능한 이름입니다.';
      flag = true;
    }

    // 객체 프로퍼티에서 세팅하는 변수의 이름과 키값이 동일한 경우에는 콜론 생략이 가능!
    saveInputState({
      // 이거 근데 리듀서 써도 되긴 하다고 하쉼
      key: 'userName', // 지금 함수가 어디에서 불렸느냐를 알리기 위함
      inputValue, // inputValue: inputValue 프로퍼티명과 변수명이 동일한 경우, 프로퍼티명 생략 가능!!
      msg,
      flag,
    });
  };

  // 이메일 중복 체크 서버 통신 함수
  const fetchDuplicateCheck = (email) => {
    let msg = '',
      flag = false;
    fetch(`${API_BASE_URL}/check?email=${email}`)
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
      })
      .then((json) => {
        // console.log(json);
        if (json) {
          // 중복됨
          msg = '이메일이 중복되었습니다.';
        } else {
          // 중복 안됨
          msg = '사용 가능한 이메일 입니다.';
          flag = true;
        }
        // fetch 내부의 동작 가장 마지막에 동작하도록 하려면 then 절 내부로 가장 하단에 위치해야함
        // fetch 함수 외부로 빼버리면 또 비동기니까 순서 꼬여벌임
        saveInputState({
          key: 'email',
          inputValue: email,
          msg,
          flag,
        });
      })
      .catch((err) => {
        console.log('서버통신이 원활하지 않습니다.');
      });
  };

  // 이메일 입력창 체인지 이벤트 핸들러
  const emailHandler = (e) => {
    const inputValue = e.target.value;
    const emailRegex = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;

    let msg;
    let flag = false;

    if (!inputValue) {
      msg = '이메일은 필수값 입니다!';
    } else if (!emailRegex.test(inputValue)) {
      msg = '이메일 형식이 올바르지 않습니다.';
    } else {
      // 이메일 중복 체크
      fetchDuplicateCheck(inputValue);
    }

    saveInputState({
      key: 'email',
      inputValue,
      msg,
      flag,
    });
  };

  // 패스워드 입력창 체인지 이벤트 핸들러
  const passwordHandler = (e) => {
    // passwordHandler 는 렌더링 종료 후 호출되는 것이 보장됨(상식적으로)
    // 그래서 바닐라자바스크립트 문법으로 태그를 지목해보자!
    // 이벤트핸들러 함수 내부에서 지목하는 거라서 지목이 가능한 것~
    document.getElementById('password-check').value = '';

    // 패스워드가 변경될 때마다 패스워드 확인 창을 비우고 시작할 것임.
    // 하단의 확인 메시지와 correct flag를 초기화해줌.
    setMessage({ ...message, passwordCheck: '' });
    setCorrect({ ...correct, passwordCheck: false });

    const inputValue = e.target.value;
    const pwRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,20}$/;

    let msg;
    let flag = false;
    if (!inputValue) {
      msg = '비밀번호는 필수입니다.';
    } else if (!pwRegex.test(inputValue)) {
      msg = '8글자 이상의 영문, 숫자, 특수문자를 포함해주세요.';
    } else {
      msg = '사용 가능한 비밀번호 입니다.';
      flag = true;
    }

    saveInputState({
      key: 'password',
      inputValue,
      msg,
      flag,
    });
  };

  // 비밀번호 확인란 체인지 이벤트 처리!
  const pwCheckHandler = (e) => {
    let msg;
    let flag = false;
    // 비밀번호 확인은 fetch로 안넘길 거니까 inputValue는 필요없음

    if (!e.target.value) {
      msg = '비밀번호 확인란은 필수입니다.';
    } else if (userValue.password !== e.target.value) {
      msg = '패스워드가 일치하지 않습니다.';
    } else {
      msg = '패스워드가 일치합니다.';
      flag = true;
    }

    saveInputState({
      key: 'passwordCheck',
      inputValue: 'pass',
      msg,
      flag,
    });
  };

  // 4개의 입력칸이 모두 검증에 통과했는지 여부를 검사
  const isValid = () => {
    for (const key in correct) {
      // 객체를 반복문으로 돌릴때는 in 이고, 그 객체의 프로퍼티가 하나씩 온대!
      const flag = correct[key]; //correct.[key(프로퍼티명)] 의 boolean 값을 flag에 하나씩 넣어보고,,,
      if (!flag) return false;
    } // 중간에 값이 false 인게 하나라도 있다면 바로 false를 반환하겠다!
    return true;
  };

  // 회원가입 처리 서버 요청
  const fetchSignUpPost = () => {
    fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(userValue),
    }).then((res) => {
      if (res.status === 200) {
        alert('회원가입에 성공했습니다.');
        // 로그인 페이지로 리다이렉트
        // window.location.href = '/login';
        redirection('/login'); // 리액트에서 리다이렉트 하는 방법.
      } else {
        alert('서버와의 통신이 원활하지 않습니다. 관리자에게 문의하세요.');
      }
    });
  };

  // 회원가입 버튼 클릭 이벤트 핸들러
  const joinButtonClickHandler = (e) => {
    e.preventDefault();

    if (isValid()) {
      // 회원가입 서버 요청
      fetchSignUpPost();
    } else {
      alert('입력란을 다시 확인해주세요.');
    }
  };

  return (
    <Container
      component='main'
      maxWidth='xs'
      style={{ margin: '200px auto' }}
    >
      <form noValidate>
        <Grid
          container
          spacing={2}
        >
          <Grid
            item
            xs={12}
          >
            <Typography
              component='h1' // 태그는 h1
              variant='h5' // 내용물은 h5 스타일로!
            >
              계정 생성
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
          >
            <TextField
              autoComplete='fname'
              name='username'
              variant='outlined'
              required
              fullWidth
              id='username'
              label='유저 이름'
              autoFocus
              onChange={nameHandler} // 함수 같은 경우는 Handler를 붙이고, prop로 넘길 땐 on을 붙여주는걸 추천!
            />
            <span
              style={correct.userName ? { color: 'green' } : { color: 'red' }}
            >
              {message.userName}
            </span>
          </Grid>
          <Grid
            item
            xs={12}
          >
            <TextField
              variant='outlined'
              required
              fullWidth
              id='email'
              label='이메일 주소'
              name='email'
              autoComplete='email'
              onChange={emailHandler}
            />
            <span style={correct.email ? { color: 'green' } : { color: 'red' }}>
              {message.email}
            </span>
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
              label='패스워드'
              type='password'
              id='password'
              autoComplete='current-password'
              onChange={passwordHandler}
            />
            <span
              style={correct.password ? { color: 'green' } : { color: 'red' }}
            >
              {message.password}
            </span>
          </Grid>

          <Grid
            item
            xs={12}
          >
            <TextField // 텍스트 입력 창만 제공하는 컴포넌트가 아님! 문서 확인 후 필요한 양식을 가져와서 사용 가능! (mui)
              variant='outlined'
              required
              fullWidth
              name='password-check'
              label='패스워드 확인'
              type='password'
              id='password-check'
              autoComplete='check-password'
              onChange={pwCheckHandler}
            />
            <span
              id='check-span'
              style={
                correct.passwordCheck ? { color: 'green' } : { color: 'red' }
              }
            >
              {message.passwordCheck}
            </span>
          </Grid>

          <Grid // 배치 목적의 크기조절을 위한 컴포넌트 (mui)
            item
            xs={12}
          >
            <Button
              type='submit'
              fullWidth
              variant='contained'
              style={{ background: '#38d9a9' }}
              onClick={joinButtonClickHandler}
            >
              계정 생성
            </Button>
          </Grid>
        </Grid>
        <Grid
          container
          justify='flex-end'
        >
          <Grid item>
            <Link
              href='/login'
              variant='body2'
            >
              이미 계정이 있습니까? 로그인 하세요.
            </Link>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default Join;
