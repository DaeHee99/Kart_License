import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MDBNavbar,
  MDBContainer,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBNavbarToggler,
  MDBNavbarBrand,
  MDBCollapse
} from 'mdb-react-ui-kit';
import HeaderLogo from '../../images/header.png'

export default function App() {
  const navigation = useNavigate();
  const [showNavColor, setShowNavColor] = useState(false);

  return (
    <>
      <MDBNavbar sticky expand='lg' dark bgColor='primary'>
        <MDBContainer fluid>
        <MDBNavbarToggler
            type='button'
            data-target='#navbarColor02'
            aria-controls='navbarColor02'
            aria-expanded='false'
            aria-label='Toggle navigation'
            onClick={()=>{navigation(-1); setShowNavColor(false)}}
          >
            <MDBIcon fas icon="angle-left" />
          </MDBNavbarToggler>
          <MDBNavbarBrand onClick={()=>{navigation('/'); setShowNavColor(false)}} width={200} className='mx-0' style={{cursor: 'pointer'}}>
            <img src={HeaderLogo} alt='headerLogo' width={200} className='mx-0'/>
          </MDBNavbarBrand>
          <MDBNavbarToggler
            type='button'
            data-target='#navbarColor02'
            aria-controls='navbarColor02'
            aria-expanded='false'
            aria-label='Toggle navigation'
            onClick={() => setShowNavColor(!showNavColor)}
          >
            <MDBIcon icon='bars' fas />
          </MDBNavbarToggler>
          <MDBCollapse show={showNavColor} navbar>
            <MDBNavbarNav className='me-auto mb-2 mb-lg-0'>
              <MDBNavbarItem className='active'>
                <MDBNavbarLink aria-current='page' onClick={()=>{navigation('/'); setShowNavColor(false)}}>
                  홈
                </MDBNavbarLink>
              </MDBNavbarItem>
              <MDBNavbarItem>
                <MDBNavbarLink  onClick={()=>{navigation('/statistics'); setShowNavColor(false)}}>통계</MDBNavbarLink>
              </MDBNavbarItem>
              <MDBNavbarItem>
                <MDBNavbarLink  onClick={()=>{alert('업데이트 준비 중'); navigation('/'); setShowNavColor(false)}}>커뮤니티</MDBNavbarLink>
              </MDBNavbarItem>
              <MDBNavbarItem>
                <MDBNavbarLink  onClick={()=>{navigation('/manager'); setShowNavColor(false)}}>관리자</MDBNavbarLink>
              </MDBNavbarItem>
              <MDBNavbarItem>
                <MDBNavbarLink  onClick={()=>{navigation('/mypage'); setShowNavColor(false)}}>마이페이지</MDBNavbarLink>
              </MDBNavbarItem>
              <MDBNavbarItem>
                <MDBNavbarLink  onClick={()=>{navigation('/login'); setShowNavColor(false)}}>로그인</MDBNavbarLink>
              </MDBNavbarItem>
            </MDBNavbarNav>
          </MDBCollapse>
        </MDBContainer>
      </MDBNavbar>
      <br />
    </>
  );
}