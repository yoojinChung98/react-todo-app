import React, { useState } from 'react';

// 새로운 전역 컨텍스트 생성 (사용자의 로그인 상태 체크)
const AuthContext = React.createContext({
  isLoggedIn: false, // 로그인 했는지의 여부 추적
  userName: '',
  onLogOut: () => {},
  onLogin: (email, password) => {},
});

// 위에서 생성한 Context를 제공할 수 있는 provider 선언.(그러면 consumer 도 있겟지?)
// 이 컴포넌트를 통해 자식 컴포넌트에게 인증 상태와 관련된 함수들을 전달할 수 있음.
export const AuthContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  // 로그아웃 핸들러
  const logoutHandler = () => {
    localStorage.clear(); // 로컬 스토리지 내용 전체 삭제
    setIsLoggedIn(false);
    setUserName('');
  };

  // 로그인 핸들러
  const loginHandler = (token, userName, role) => {
    localStorage.setItem('isLoggedIn', '1'); // 1 또는 0 으로 관리할 것.
    //json에 담긴 인증정보를 클라이언트에 보관
    // 1. 로컬 스토리지 - 브라우저가 종료되어도 보관됨.
    // 2. 세션 스토리지 - 브라우저가 종료되면 사라짐.
    localStorage.setItem('ACCESS_TOKEN', token);
    localStorage.setItem('LOGIN_USERNAME', userName);
    localStorage.setItem('USER_ROLE', role);
    setIsLoggedIn(true);
    setUserName(userName);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userName,
        onLogout: logoutHandler, // 로그아웃 핸들러도 제공.(Header.js 에서 꺼내 쓰기 위함.)
        onLogin: loginHandler, // 로그인핸들러를 onLogin이라는 이름으로 보냄 Provider를 쓰면 props를 단계별로 전달할 필요 없이 전역적으로 사용할 수 있음.
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
