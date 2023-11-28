//AuthContext.js 를 쓰기로 했고 얘는 사실상 걍 아무짝에도 쓸모없어짐,, 삭제해도 될 것 같은데?

// 로그인 한 유저의 데이터 객체를 반환하는 함수
export const getLoginUserInfo = () => {
  // 함수 자체를 export 해서 사용할 때는 이렇게 함수 앞에 export 를 붙이면 됨.
  return {
    token: localStorage.getItem('ACCESS_TOKEN'),
    username: localStorage.getItem('LOGIN_USERNAME'),
    role: localStorage.getItem('USER_ROLE'),
  };
};

// 로그인 여부를 확인하는 함수
// const isLogin = () => {
//     const token = localStorage.getItem('ACCESS_TOKEN');
//     if(token === null) return false;
//     return true;
// };

// 위의 식은 아래로 짧게 단축할 수 있음.

export const isLogin = () => !!localStorage.getItem('ACCESS_TOKEN');
// 앞의 느낌표 두개를 붙이면 의미가
// !! -> 자바스크립트에서 느낌표 두개는 논리값으로 바꾸겠다는 의미
// 하나의 느낌표 -> 뒤에 들어온 값을 논리적으로 해석하겠다(근데 논리반전연산자라서 의미가 반전되지). 그래서 느낌표를 하나 더 붙여서 반전된 것을 다시 원래대로 복구하는 것(근데 이제 완전 논리값이 되겠지.)

// 즉, 겟아이템 한 값이 null = false, 값이 들어있다 = true 라는 의미가 되는 것. 결국엔 상단의 코드와 동일한 내용이 되는거지!!
