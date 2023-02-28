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
import Logo from '../../images/logo.png';

export default function Notice(props) {
  return (
    <MDBModal staticBackdrop show={props.showModal} setShow={props.setModal} tabIndex='-1'>
      <MDBModalDialog centered>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle className='fw-bold'>공지사항</MDBModalTitle>
            <MDBBtn
              className='btn-close'
              color='none'
              onClick={() => props.setModal(false)}
            ></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
            <p className='text-center'>
              {props.content}
            </p>
            <img src={Logo} alt='Logo' className='w-100 rounded-4'/>
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color='secondary' onClick={() => props.setModal(false)} className='fw-bold w-100'>
              닫기
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}