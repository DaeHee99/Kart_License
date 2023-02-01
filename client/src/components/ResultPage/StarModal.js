import React, { useState } from 'react';
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBTextArea,
  MDBIcon
} from 'mdb-react-ui-kit';

export default function StarModal(props) {
  const [star, setStar] = useState(1);
  const [text, setText] = useState('');

  const textHandler = (event) => setText(event.target.value);
  

  return (
    <MDBModal staticBackdrop tabIndex='-1' show={props.starOpen} setShow={props.setStarOpen}>
      <MDBModalDialog centered>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle><b>후기 작성</b></MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={()=>props.setStarOpen(false)}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
            <div className='m-0'>
              <div className='text-center mb-3 text-warning'>
                <MDBIcon far={star<1} fas={star>=1} onClick={()=>setStar(1)} icon="star" size='2x' style={{cursor: 'pointer'}}/>
                <MDBIcon far={star<2} fas={star>=2} onClick={()=>setStar(2)} icon="star" size='2x' style={{cursor: 'pointer'}}/>
                <MDBIcon far={star<3} fas={star>=3} onClick={()=>setStar(3)} icon="star" size='2x' style={{cursor: 'pointer'}}/>
                <MDBIcon far={star<4} fas={star>=4} onClick={()=>setStar(4)} icon="star" size='2x' style={{cursor: 'pointer'}}/>
                <MDBIcon far={star<5} fas={star>=5} onClick={()=>setStar(5)} icon="star" size='2x' style={{cursor: 'pointer'}}/>
              </div>
              <MDBTextArea
                value={text}
                onChange={textHandler}
                label='후기'
                rows={4}
              />
            </div>
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color='secondary' onClick={()=>props.setStarOpen(false)}>
              <b>취소</b>
            </MDBBtn>
            <MDBBtn>
              <b>완료</b>
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}