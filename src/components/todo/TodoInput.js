import React, { useState } from 'react';
import { MdAdd } from 'react-icons/md';
import cn from 'classnames'; //클래스네임즈라는 라이브러리?

import './scss/TodoInput.scss';

const TodoInput = ({ addTodo }) => {
  // 입력창이 열리는 여부를 표현하는 상태값
  const [open, setOpen] = useState(false); // 처음에는 안열려 있으니까 기본값은 false

  // 할 일 입력 창에 입력한 내용을 표현하는 상태값
  const [todoText, setTodoText] = useState('');

  // + 버튼 클릭 시 발생하는 이벤트
  const onToggle = () => {
    // const $btn = document.querySelector('.insert-btn');
    // $btn.classList.toggle('open'); // 바닐라라면 이렇게 썼을 것! toggle: 없으면 추가/ 있으면 삭제
    setOpen(!open); // 만약 true로 설정하면 x -> + 로 설정하는것은 할 수 없으므로 !open으로 값을 줘야함.
  };

  // input change 이벤트 핸들러
  const todoChangeHandler = (e) => {
    setTodoText(e.target.value);
  };

  // submit 이벤트 핸들러
  const submitHandler = (e) => {
    e.preventDefault(); // 태그의 기본 기능 제한(submit 막기)

    // 부모 컴포넌트가 전달한 함수의 매개값으로 입력값 넘기기
    addTodo(todoText);

    // 입력이 끝나면 입력창 비우기
    setTodoText('');
  };

  return (
    <>
      {open && ( // 조건부 랜더링. open 이 false면 false라서 태그부분은 돌지도 않음.
        <div className='form-wrapper'>
          <form
            className='insert-form'
            onSubmit={submitHandler}
          >
            <input
              type='text'
              placeholder='할 일을 입력 후, 엔터를 누르세요!'
              onChange={todoChangeHandler}
              value={todoText}
            />
          </form>
        </div>
      )}

      {/* 
          cn() : 첫번째 파라미터는 항상 유지할 default 클래스
                 두번째 파라미터는 논리 상태값
                 
                 => 논리 상태값이 true일 경우 해당 클래스 추가
                    false일 경우 제거.
                    {클래스이름: 논리값}, ( 예시 : {'open':open} / { merong : open}-> open값에 따라 merong클래스 뗏붙 )
                    클래스 이름 지정 안할 시 변수명이 클래스 이름으로 사용됨. (그니까 클래스명이랑 변수가 같은 경우!)
        */}
      <button
        className={cn('insert-btn', { open })} // cn(항상 있어야 하는 값(insert-btn 문자열(클래스명)), {useState변수})
        onClick={onToggle}
      >
        <MdAdd />
      </button>
    </>
  );
};

export default TodoInput;
