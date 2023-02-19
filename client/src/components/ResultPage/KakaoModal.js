import React from 'react';
import { useSelector } from 'react-redux';
import { API } from '../../_actions/types';
import axios from 'axios';
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from 'mdb-react-ui-kit';

export default function KakaoModal(props) {
  const Kakao = window.Kakao;
  const userData = useSelector(state => state.user.userData);

  if (!Kakao.isInitialized()) {
    Kakao.init('b8190aef6784cd429762070f590774bb');
  }

  const kakaoShare = () => {
    Kakao.Share.sendCustom({
      templateId: 90173,
      templateArgs: {
        RecordId: props.recordId,
        Name: userData.isAuth ? userData.name : '비로그인 유저',
        Description: userData.isAuth ? `${userData.name}님이 카러플 군 계산기 결과를 공유했습니다!` : '츄르 클럽에서 제작한 카러플 군 계산기 결과를 공유했습니다!',
        ProfileImage: userData.isAuth ? userData.image : "https://firebasestorage.googleapis.com/v0/b/kart-chu-club.appspot.com/o/licenseImages%2Fdao.png?alt=media&token=507c8b83-7c6f-4715-807d-3da2b01e25e0",
        UserId: userData.isAuth ? userData._id : '0'
      },
    });

    let body = {content: `카카오톡 공유 완료`};
    if(userData.isAuth) body.user = userData._id;

    axios.post(API+'/log/save', body, {withCredentials: true});

    props.setShareOpen(false);
  }        

  return (
    <MDBModal staticBackdrop tabIndex='-1' show={props.shareOpen} setShow={props.setShareOpen}>
      <MDBModalDialog centered>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle><b>카카오톡 공유하기</b></MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={()=>props.setShareOpen(false)}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
            <p className='text-center m-0'>
              <b>이 결과를 카카오톡으로 공유하시겠습니까?</b>
              <img width={'100%'} src='https://play-lh.googleusercontent.com/8_0SDfkFXAFm12A7XEqkyChCdGC055J6fC8JR7qynNuO3qNOczIoNHo4U4lad8xYMJOL' alt='kakao' className='rounded-3'/>
            </p>
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color='secondary' onClick={()=>props.setShareOpen(false)}>
              <b>취소</b>
            </MDBBtn>
            <MDBBtn onClick={kakaoShare}>
              <b>공유하기</b>
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}