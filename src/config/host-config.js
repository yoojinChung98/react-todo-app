// 브라우저에서 현재 클라이언트의 호스트 이름 얻어오기
const clientHostName = window.location.hostname; // 기본적으로 브라우저에서 제공하는 기능.

//백엔드 서버 호스트 이름
let backEndHostName;

if (clientHostName === 'localhost') {
  // localhost 는,,, 소문자야,, 유진아,,,
  // 개발 중
  backEndHostName = 'http://localhost:8181';
} else if (clientHostName === 'spring.com') {
  // 배포해서 서비스 중 (이 쪽은 걍 예시일 뿐!)
  backEndHostName = 'https://api.spring.com';
}

export const API_BASE_URL = backEndHostName;
export const TODO = '/api/todos';
export const USER = '/api/auth';
