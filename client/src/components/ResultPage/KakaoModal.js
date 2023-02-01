import React from 'react';
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
              <img width={'100%'} src='https://play-lh.googleusercontent.com/8_0SDfkFXAFm12A7XEqkyChCdGC055J6fC8JR7qynNuO3qNOczIoNHo4U4lad8xYMJOL'/>
            </p>
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color='secondary' onClick={()=>props.setShareOpen(false)}>
              <b>취소</b>
            </MDBBtn>
            <MDBBtn>
              <b>공유하기</b>
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}