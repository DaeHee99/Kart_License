import React from 'react';
import {
  MDBFooter,
  MDBContainer
} from 'mdb-react-ui-kit';
import FooterLogo from '../../images/footerLogo.png'

export default function Footer() {
  return (
    <MDBFooter bgColor='primary' className='text-white text-center text-lg-left'>
      <MDBContainer className='p-3 pb-0'>
        <section className='mb-3'>
          <img src={FooterLogo} alt='footerLogo' style={{width: '25%', maxWidth: 150}}/>
        </section>
      </MDBContainer>

      <div className='text-center p-3' style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        츄르 &copy; {new Date().getFullYear()} Copyright:{' '}
        <a className='text-white' href='https://open.kakao.com/o/swJ90z0d'>
          앵두새
        </a>
      </div>
    </MDBFooter>
  );
}