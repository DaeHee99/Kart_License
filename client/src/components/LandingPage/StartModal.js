import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MDBBtn, MDBModal, MDBModalDialog, MDBModalContent, MDBModalBody } from 'mdb-react-ui-kit';

export default function StartModal(props) {
  const navigation = useNavigate();

  return (
    <>
      <MDBModal animationDirection='bottom' show={props.showModal} tabIndex='-1' setShow={props.setModal}>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalBody className='py-1'>
              <div className='d-flex justify-content-around align-items-center my-3'>
                <p className='mb-0'>비로그인 상태입니다.<br />로그인 없이 그냥 진행할까요?</p>
                <MDBBtn color='success' size='sm' className='ms-2' onClick={()=>{navigation('/test')}}>
                  <b>그냥 시작하기</b>
                </MDBBtn>
                <MDBBtn size='sm' className='ms-2' onClick={()=>{navigation('/login')}}>
                  <b>로그인 하기</b>
                </MDBBtn>
              </div>
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}