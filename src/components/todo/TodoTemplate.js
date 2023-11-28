import React, { useEffect, useState } from 'react';
import TodoHeader from './TodoHeader';
import TodoMain from './TodoMain';
import TodoInput from './TodoInput';
import './scss/TodoTemplate.scss';

import { API_BASE_URL as BASE, TODO } from '../../config/host-config';
import { useNavigate } from 'react-router-dom';
import { getLoginUserInfo } from '../../utils/login-util';

const TodoTemplate = () => {
  const redirection = useNavigate();

  // 로그인 인증 토큰 얻어오기
  const { token } = getLoginUserInfo();

  // fetch 요청 보낼 때 사용할 요청 헤더 설정
  const requestHeader = {
    'content-type': 'application/json',
    // JWT 에 대한 인증 토큰이라는 타입을 선언 (토큰 값을 통해서 사용자가 누구인지 인식할 수 있도록 할 것임.) : Bearer : 해당 토큰의 타입이 무엇인지 알려줌.
    Authorization: 'Bearer ' + token,
  };

  // 서버에 할 일 목록(json)을 요청(fetch)해서 받아와야 함.
  // const API_BASE_URL = 'http://localhost:8181/api/todos'; // 기본 요청url을 변수화 시키겠다~ (host-config.js 파일에서 설정함.)
  const API_BASE_URL = BASE + TODO;

  // todos 배열을 상태 관리
  const [todos, setTodos] = useState([]);

  // id값 시퀀스 함수 (DB 연동시키면 필요없게 됨.)
  const makeNewId = () => {
    if (todos.length === 0) return 1;
    return todos[todos.length - 1].id + 1; // 맨 마지막 할일 객체의 id보다 하나 크게
  };

  /*
 todoInput에게 todoText를 받아오는 함수
 자식 컴포넌트가 부모 컴포넌틑에게 데이터를 전달할 때는
 일반적인 props 사용이 불가능.
 부모 컴포넌트에서 함수를 선언(매개변수 꼭 선언) -> props로 함수를 전달
 자식 컴포넌트에서 전달받은 함수를 호출하면서 매개값으로 데이터를 전달.
*/
  const addTodo = async (todoText) => {
    const newTodo = {
      title: todoText,
    }; // fetch를 이용해서 백엔드에 insert 요청 보내야 함.

    // todos.push(newTodo); (X) -> Ustate변수를 누가 이렇게 바꿔,,, 세터 써야지,,,
    // setTodos(newTodo); (X) -> 리액트의 상태변수는 불변성(immutable) 을 가지기 때문에
    // 기본존상태에서ㅔ 벼녁은 불가능 = 새로운 상태로 만들어서 변경해야 함!!

    // setTodos((oldtodos) => {
    //   //t 에는 가장 최신의 상태값이 옴.(콜백함수쓰면 그렇게 됨)
    //   return [...oldtodos, newTodo];
    // });

    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(newTodo),
    });

    const json = await res.json();
    setTodos(json.todos);

    /*
    fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(newTodo),
    })
      .then((res) => res.json())
      .then((json) => {
        setTodos(json.todos);
      });
    */
  };

  // 할 일 삭제 처리 함수
  const removeTodo = (id) => {
    // // 주어진 배열의 값들을 순회화여 조건에 맞는 요소들만 모아서 새로운 배열로 리턴.
    // setTodos(todos.filter((todo) => todo.id !== id));

    // fetch(API_BASE_URL + '/' + id, {
    fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((json) => {
        setTodos(json.todos);
      });
  };

  // 할 일 체크 처리 함수
  const checkTodo = (id, done) => {
    /* // 이거는 그냥 for문 돌려보는것!
    const copyTodos = [...todos];
    for (let cTodo of copyTodos) {
      if (cTodo.id === id) {
        cTodo.done = !cTodo.done;
      }
    }23115654181
    setTodos(copyTodos);
    */
    /*
    setTodos(
      todos.map(
        // 기존의 todo의 프로퍼티는 그대로 가져가지만 done 값만 바꿔가겠다! 그리고 그 객체를 리턴하겠다!!
        (todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)
      )
    );
    */

    // // id랑 done 받기로 했네? 근데 그것도 반전된 done값 던져줘야 하네,,,? 아 ,,귀찮다
    fetch(API_BASE_URL, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        done: !done,
        id: id,
      }),
    })
      .then((res) => res.json())
      .then((json) => setTodos(json.todos));
  };

  // 체크가 안 된 할 일의 개수 카운트 하기
  const countRestTodo = () => todos.filter((todo) => !todo.done).length;

  useEffect(() => {
    // 페이지가 처음 렌더링 됨과 동시에 할 일 목록을 서버에 요청해서 뿌려 주겠습니다.
    fetch(API_BASE_URL, {
      method: 'GET',
      headers: requestHeader, // Header에 들은 JWT 의 내용을 헤더에 담아서 보냄.
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);

        // fetch를 통해 받아온 데이터를 상태변수에 할당하겠음.
        setTodos(json.todos);
      });
  }, []); // 의존배열이 비어있다면 최초 실행시 1회 작동. / 의존배열에 값을 넣으면 해당 값에 변화가 감지될 때(최초1회 포함)마다 작동

  return (
    <div className='TodoTemplate'>
      <TodoHeader count={countRestTodo} />
      <TodoMain
        todoList={todos}
        remove={removeTodo}
        check={checkTodo}
      />
      <TodoInput addTodo={addTodo} />
    </div>
  );
};

export default TodoTemplate;
