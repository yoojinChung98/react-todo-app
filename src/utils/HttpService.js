// 이 파일은 모든 fetch 마다 내용물을 까보고 status 에 따라 로직을 작성하는게 귀찮으니까!
// 상태가 401인 애들만 일괄로 처리해줄 수 있는 설정을 하기 위해 생성했음

import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';

const HttpService = async (url, options) => {
  const redirection = useNavigate();
  const { onLogout } = useContext(AuthContext);

  const res = await fetch(url, options);

  if (res.status === 401) {
    // 토큰 만료 관련 처리 (일괄적으로)
    const data = await res.json();
    console.log('401 토큰 만료!', data);
    onLogout();
    alert('토큰이 만료되었습니다. 다시 로그인해주세요');
    redirection('/login');
  }

  return res;
};

export default HttpService;
