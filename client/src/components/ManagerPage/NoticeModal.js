import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API } from '../../_actions/types';
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBTextArea
} from 'mdb-react-ui-kit';

export default function NoticeModal(props) {
  const userData = useSelector(state => state.user.userData);
  const [text, setText] = useState('');

  const textHandler = (event) => setText(event.target.value);

  const deleteHander = () => {
    axios.get(API+'/notice', {withCredentials: true}).then(response => {
      if(!response.data.success) return alert('서버 오류');
      if(response.data.data.length === 0) return alert('삭제할 공지가 없습니다.');

      axios.delete(API+'/notice', {withCredentials: true}).then(response => {
        if(!response.data.success) return alert('서버 오류');
        alert('이전 공지 삭제 완료!');
        props.setNoticeOpen(false);
      })
    })
  }
  
  const submitHandler = () => {
    if(text === '') return alert('새로운 공지를 작성하고 등록해주세요.');
    let body = {
      content : text,
      show : true
    }
    if(userData.isAuth) body.user = userData._id;
    else return alert('관리자 로그인을 다시 확인해주세요.');

    axios.post(API+'/notice/save', body, {withCredentials: true}).then(response => {
      if(!response.data.success) return alert('등록 실패, 서버 오류');
      alert('공지 등록이 완료 되었습니다!');
      props.setNoticeOpen(false);
      setText('');
    });
  }

  return (
    <MDBModal staticBackdrop tabIndex='-1' show={props.noticeOpen} setShow={props.setNoticeOpen}>
      <MDBModalDialog centered>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle><b>공지 등록 & 삭제</b></MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={()=>props.setNoticeOpen(false)}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
            <div className='m-0'>
              <div className='text-center mb-3 text-warning'>
                <MDBBtn color='danger' className='w-100' onClick={deleteHander}>이전 공지 삭제</MDBBtn>
              </div>
              <MDBTextArea
                value={text}
                onChange={textHandler}
                label='새로운 공지'
                rows={4}
              />
            </div>
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color='secondary' onClick={()=>props.setNoticeOpen(false)}>
              <b>취소</b>
            </MDBBtn>
            <MDBBtn onClick={submitHandler}>
              <b>등록</b>
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}