import {
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';

import { API_BASE_URL as BASE, USER } from '../../config/host-config';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../utils/AuthContext';
import CustomSnackBar from '../layout/CustomSnackBar';
import './join.scss';
import addImage from '../../assets/img/image-add.png';

const Join = () => {
  // useRef를 이용하여 태그 참조하기.
  const $fileTag = useRef();

  // 리다이렉트 사용하기
  const redirection = useNavigate();

  const { isLoggedIn } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      // 스낵바 오픈
      setOpen(true);
      // 일정 시간 뒤 Todo 화면으로 redirect
      setTimeout(() => {
        redirection('/');
      }, 3000);
    }
  }, [isLoggedIn, redirection]);

  const API_BASE_URL = BASE + USER;

  // 상태변수로 회원가입 입력값 관리
  const [userValue, setUserValue] = useState({
    userName: '',
    password: '',
    email: '',
  });

  // 검증 메세지에 대한 상태변수 관리
  // 입력값과 메세지는 따로 상태 관리(메세지는 백엔드로 보내줄 필요 없음.)
  // 메세지 영역이 각 입력창마다 있기 때문에 객체를 활용해서 한 번에 관리.
  const [message, setMessage] = useState({
    userName: '',
    password: '',
    passwordCheck: '',
    email: '',
  });

  // 검증 완료 체크에 대한 상태변수 관리
  // 각각의 입력창마다 검증 상태를 관리해야 하기 때문에 객체로 선언.
  // 상태를 유지하려는 이유 -> 마지막에 회원 가입 버튼을 누를 때 까지 검증 상태를 유지해야 하기 때문.
  const [correct, setCorrect] = useState({
    userName: false,
    password: false,
    passwordCheck: false,
    email: false,
  });

  // 검증된 데이터를 각각의 상태변수에 저장해 주는 함수.
  const saveInputState = ({ key, inputValue, flag, msg }) => {
    // 입력값 세팅
    // 패스워드 확인 입력값은 굳이 userValue 상태로 유지할 필요가 없기 때문에
    // 임의의 문자열 'pass'를 넘기고 있습니다. -> pass가 넘어온다면 setUserValue()를 실행하지 않겠다.
    inputValue !== 'pass' &&
      setUserValue((oldVal) => {
        return { ...oldVal, [key]: inputValue };
      });

    // 메세지 세팅
    setMessage((oldMsg) => {
      return { ...oldMsg, [key]: msg }; // key 변수의 값을 프로퍼티 이름으로 활용.
    });

    // 입력값 검증 상태 세팅
    setCorrect((oldCorrect) => {
      return { ...oldCorrect, [key]: flag };
    });
  };

  // 이름 입력창 체인지 이벤트 핸들러
  const nameHandler = (e) => {
    const nameRegex = /^[가-힣]{2,5}$/;
    const inputValue = e.target.value;

    // 입력값 검증
    let msg; // 검증 메세지를 저장할 변수
    let flag = false; // 입력값 검증 여부 체크 변수

    if (!inputValue) {
      msg = '유저 이름은 필수입니다.';
    } else if (!nameRegex.test(inputValue)) {
      msg = '2~5글자 사이의 한글로 작성하세요!';
    } else {
      msg = '사용 가능한 이름입니다.';
      flag = true;
    }

    // 객체 프로퍼티에서 세팅하는 변수의 이름과 키값이 동일한 경우에는
    // 콜론 생략이 가능.
    saveInputState({
      key: 'userName',
      inputValue,
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
          msg = '이메일이 중복되었습니다.';
        } else {
          msg = '사용 가능한 이메일 입니다.';
          flag = true;
        }
        saveInputState({
          key: 'email',
          inputValue: email,
          msg,
          flag,
        });
      })
      .catch((err) => {
        console.log('서버 통신이 원활하지 않습니다.');
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
    // 패스워드가 변경됐다? -> 패스워드 확인란을 비우고 시작하자.
    document.getElementById('password-check').value = '';

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
      msg = '8글자 이상의 영문, 숫자, 특수문자를 포함해 주세요.';
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

  // 비밀번호 확인란 체인지 이벤트 핸들러
  const pwCheckHandler = (e) => {
    let msg;
    let flag = false;
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
      const flag = correct[key];
      if (!flag) return false;
    }
    return true;
  };

  // 회원 가입 처리 서버 요청
  const fetchSignUpPost = async () => {
    /*
    하단 코드는 이미지파일이 없을때의 코드임
    fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(userValue),
    }).then((res) => {
      if (res.status === 200) {
        alert('회원가입에 성공했습니다.');
        // 로그인 페이지로 리다이렉트
        // window.location.href = '/login';
        redirection('/login');
      } else {
        alert('서버와의 통신이 원활하지 않습니다. 관리자에게 문의하세요.');
      }
    });
    */

    /*
      기존 회원가입은 단순히 텍스트를 객체로 모은 후 JSON으로 변환해서 요청 보내면 끝이었음.
      이제는 프로필 이미지가 추가됨. -> 파일 첨부 요청은 multipart/form-data 로 전송해야 함.
      그래서 FormData 객체를 활용해서 Content-type을 multipart/form-data로 지정한 후 전송하려 함.
      그럼 JSON 데이터는? Content-type이 application/json임..
      Content-type이 서로 다른 데이터를 한번에 FormData에 감싸서 보내면 415(unsupported Media Type) 에러 발생
      
      그렇다면 JSON을 -> Blob으로 바꿔서 함께 보내자. Blob은 이미지, 사운드, 비디오 같은 멀티미디어 파일을
      바이트 단위로 쪼개어 파일의 손상을 방지하게 해주는 타입. => multipart/form-data에도 허용됨.
    */

    // JSON 데이터를 Blob(Binary large object) 타입으로 변경 후 FormData에 넣어줄 수 있음.
    const userJsonBlob = new Blob([JSON.stringify(userValue)], {
      // 자바스크립트에서 제공하는 객체 Blob();
      type: 'application/json',
    });

    // 이미지 파일과 회원정보 JSON 을 하나로 묶어서 보낼 예정.
    // FormData 객체를 활용할 것 (이 객체는 JSON을 허용하지 않음)
    const userFormData = new FormData();
    userFormData.append('user', userJsonBlob);
    // 파일 객체 그 자체를 담아서 보내야함(읽어온 내용 그런거 보내면 안됨)
    userFormData.append('profileImage', $fileTag.current.files[0]);
    console.log($fileTag.current.files[0]);

    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      body: userFormData,
    });

    if (res.status === 200) {
      alert('회원가입에 성공했습니다.');
      // 로그인 페이지로 리다이렉트
      redirection('/login');
    } else {
      alert('서버와의 통신이 원활하지 않습니다.');
    }
  };

  // 회원가입 버튼 클릭 이벤트 핸들러
  const joinButtonClickHandler = (e) => {
    e.preventDefault();

    if (isValid()) {
      fetchSignUpPost();
    } else {
      alert('입력란을 다시 확인해 주세요!');
    }
  };

  // 이미지파일 상태변수
  const [imgFile, setImgFile] = useState(null);

  // 이미지 파일을 선택했을 때 썸네일 뿌리기
  const showThumbnailHandler = (e) => {
    // 첨부된 파일의 정보
    const file = $fileTag.current.files[0];

    // 이미지 파일이 아니라면 썸네일 뿌려주지도 않을 거임.
    // 첨부한 파일 이름을 얻은 후 확장자만 추출(소문자로 일괄변경)
    const fileExt = file.name.slice(file.name.indexOf('.') + 1).toLowerCase();

    if (
      fileExt !== 'jpg' &&
      fileExt !== 'png' &&
      fileExt !== 'jpeg' &&
      fileExt !== 'gif'
    ) {
      alert('이미지파일(jpg, png, jpeg, gif) 만 등록이 가능합니다!');
      // 리턴 시켜도 input 태그는 이미지가 아닌 파일을 가지고 잇으므로, 그것을 잘 비우지 않으면 서버 요청으로 넘어감(에러 유발).
      $fileTag.current.value = '';
      return;
    }

    // 자바스크립트에서 제공하는 객체 (파일을 읽어와줌)
    const reader = new FileReader();
    reader.readAsDataURL(file);

    // 다 읽었다면(로딩 끝났니? 그럼 정보를 저장할거야~)
    reader.onloadend = () => {
      setImgFile(reader.result);
    };
  };

  return (
    <>
      {!isLoggedIn && (
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
                  component='h1'
                  variant='h5'
                >
                  계정 생성
                </Typography>
              </Grid>

              {/* 프로필 이미지 그리드 추가 */}
              <Grid
                item
                xs={12}
              >
                <div
                  className='thumbnail-box'
                  // 그림을 클릭하면 input태그를 클릭한 것 처럼 할 것임
                  onClick={() => $fileTag.current.click()}
                >
                  {/* // $fileTag의.현재요소를.클릭이벤트발생.> */}
                  {/* alt : 웹접근성의 측면에서 적기를 권고.
                  장애 보조 장비가 코드를 읽어줄 때 alt 부분을 읽고,
                  이 부분을 적지 않으면 img라는 것도 잘 알려주지 않는다고 함
                  {/* 리액트에서 이미지를 띄우는 방법: 사진을 import 해서 변수에 담은 것을 괄호에 담아 사용. 
                  - 만약 import 해서 사용하기 싫다면: require('경로') 함수를 이용할 것.
      require() : node.js 에서 제공하는 함수임. */}

                  <img
                    // src={addImage}
                    src={imgFile || require('../../assets/img/image-add.png')}
                    alt='profile'
                  />
                </div>
                <label
                  className='signup-img-label'
                  htmlFor='profile-img'
                  // label 태그에서 htmlFor 프로퍼티로 input태그를 연결해놓고, 실제 input태그는 숨겨놓은 상태임.
                >
                  프로필 이미지 추가
                </label>
                <input
                  id='profile-img'
                  type='file'
                  style={{ display: 'none' }}
                  accept='image/*'
                  // useRef인 $fileTag를 지목해서 참조시켜줌.
                  ref={$fileTag}
                  // 태그에 onchange 이벤트를 걸어 썸네일이 변경되게 할 것임
                  onChange={showThumbnailHandler}
                />
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
                  onChange={nameHandler}
                />
                <span
                  style={
                    correct.userName ? { color: 'green' } : { color: 'red' }
                  }
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
                <span
                  style={correct.email ? { color: 'green' } : { color: 'red' }}
                >
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
                  style={
                    correct.password ? { color: 'green' } : { color: 'red' }
                  }
                >
                  {message.password}
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
                    correct.passwordCheck
                      ? { color: 'green' }
                      : { color: 'red' }
                  }
                >
                  {message.passwordCheck}
                </span>
              </Grid>

              <Grid
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
      )}
      <CustomSnackBar open={open} />
    </>
  );
};

export default Join;
