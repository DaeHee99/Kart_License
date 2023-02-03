import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  MDBContainer,
  MDBBadge,
  MDBCollapse,
  MDBIcon,
  MDBCardImage,
  MDBBtn,
  MDBBtnGroup
} from 'mdb-react-ui-kit';
import ResultTable from '../components/ResultPage/ResultTable';
import PieChart from '../components/ResultPage/PieChart';
import BarChart from '../components/ResultPage/BarChart';
import ResultMapTable from '../components/ResultPage/ResultMapTable';
import KakaoModal from '../components/ResultPage/KakaoModal';
import StarModal from '../components/ResultPage/StarModal';
import Footer from '../components/layout/Footer';

function ResultPage() {
  const { id } = useParams();
  const [open, setOpen] = useState('angle-up');
  const [showShow, setShowShow] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);
  const [starOpen, setStarOpen] = useState(false);

  const clickHandler = () => {
    if(open === 'angle-down') setOpen('angle-up')
    else setOpen('angle-down')
    setShowShow(!showShow);
  }

  const record = [25, 20, 15, 10, 5, 3, 2];

  return (
    // 강: danger, 주: warning, 1: warning, 2: success, 3: info, 4: primary, 일: secondary,
    <>
      <MDBContainer className='mb-7'>
        <h1><MDBBadge color='danger' light className='w-100'>
          당신은 강주력 입니다!<MDBIcon fas icon={open} onClick={clickHandler} style={{float: 'right', cursor: 'pointer'}}/>
        </MDBBadge></h1>

        <MDBCollapse show={showShow}>
          <div className="text-center fw-bold d-flex flex-row align-items-center justify-content-center">
            <div className='d-inline col-md-2 col-4 mb-0'>
              <MDBCardImage src='https://lwi.nexon.com/m_kartrush/event/2022/0816_vote_1750B8ADA92D72F3/vote2.png' alt='ProfileImage' fluid className='col-md-8 col-6'/>
              <p className='mb-0 text-nowrap'>앵두새</p>
            </div>
            <p className='mb-0 ps-3 text-secondary'>
              2023/01/01 10:00:00<br />
              S17 측정 기록
            </p>
          </div>
        </MDBCollapse>

        <div className="my-3 d-lg-flex flex-row justify-content-around">
          <div className="col-lg-6 col-12 mb-2">
            <ResultTable data={record} name={'선택 개수'}/>
            <BarChart data={record} name={'개수'}/>
          </div>
          <div className="col-lg-6 col-12 d-flex align-items-center justify-content-center">
            <PieChart data={record} name={'개수'}/>
          </div>
        </div>
        <div className="w-100">
          <ResultMapTable />
        </div>

        <MDBBtn size='lg' floating style={{ backgroundColor: '#FEE500', position: 'fixed', top: '83%', right: '50%', marginRight: '-45%', zIndex: '99' }} onClick={()=>setShareOpen(true)}>
          <MDBIcon fas icon="comment" style={{color: '#000000'}} size='lg'/>
        </MDBBtn>
        <MDBBtn size='lg' floating style={{ position: 'fixed', top: '90%', right: '50%', marginRight: '-45%', zIndex: '99' }} onClick={()=>window.scrollTo({top: 0, behavior: 'smooth'})}>
          <MDBIcon fas icon="angle-up" size='lg'/>
        </MDBBtn>

        <MDBBtnGroup shadow='0' className='w-100 my-4' size='lg'>
          <MDBBtn color='secondary'>
            <b>다시하기</b>
          </MDBBtn>
          <MDBBtn color='secondary' onClick={()=>setStarOpen(true)}>
            <b>후기 작성</b>
          </MDBBtn>
        </MDBBtnGroup>

        <MDBBtn className='w-100 text-center' style={{ backgroundColor: '#ac2bac' }} href='https://kart-chu-club.netlify.app/' size='lg'>
          <b>츄르 공식 홈페이지</b>
        </MDBBtn>

        <KakaoModal shareOpen={shareOpen} setShareOpen={setShareOpen}/>
        <StarModal starOpen={starOpen} setStarOpen={setStarOpen}/>
      </MDBContainer>
      <Footer />
    </>
  )
}

export default ResultPage;