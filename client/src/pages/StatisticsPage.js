import React, { useState } from 'react';
import {
  MDBContainer,
  MDBBadge,
  MDBCollapse,
  MDBIcon,
  MDBBtn
} from 'mdb-react-ui-kit';
import ResultTable from '../components/ResultPage/ResultTable';
import PieChart from '../components/ResultPage/PieChart';
import BarChart from '../components/ResultPage/BarChart';
import Footer from '../components/layout/Footer';

function StatisticsPage() {
  const [today] = useState(new Date());
  const [open, setOpen] = useState('angle-up');
  const [showShow, setShowShow] = useState(true);

  const clickHandler = () => {
    if(open === 'angle-down') setOpen('angle-up')
    else setOpen('angle-down')
    setShowShow(!showShow);
  }

  const data = [50, 40, 55, 76, 53, 63, 52];
  const sum = data.reduce((a, b) => a + b, 0);

  return (
    <>
      <MDBContainer className='mb-7'>
        <h1><MDBBadge color='primary' light className='w-100'>
        모든 유저의 기록 결과<MDBIcon fas icon={open} onClick={clickHandler} style={{float: 'right', cursor: 'pointer'}}/>
        </MDBBadge></h1>

        <MDBCollapse show={showShow}>
          <div className="text-center fw-bold mb-0">
            <div className="text-secondary">
              {today.getFullYear()}/{("00"+(today.getMonth()+1)).slice(-2)}/{("00"+(today.getDate())).slice(-2)} {("00"+(today.getHours())).slice(-2)}:{("00"+(today.getMinutes())).slice(-2)}:{("00"+(today.getSeconds())).slice(-2)} 기준<br />
              총 <span className='text-success'>{sum}</span>개의 기록을 성공적으로 불러왔습니다.<br />
            </div>
            모든 유저의 기록을 통해 분석된 결과입니다.
          </div>
        </MDBCollapse>

        <div className="my-3 d-lg-flex flex-row justify-content-around">
          <div className="col-lg-6 col-12 mb-2">
            <ResultTable data={data} name={'산출 횟수'}/>
            <BarChart data={data} name={'산출 횟수'}/>
          </div>
          <div className="col-lg-6 col-12 d-flex align-items-center justify-content-center">
            <PieChart data={data} name={'산출 횟수'}/>
          </div>
        </div>

        <MDBBtn size='lg' floating style={{ position: 'fixed', top: '90%', right: '50%', marginRight: '-45%', zIndex: '99' }} onClick={()=>window.scrollTo({top: 0, behavior: 'smooth'})}>
          <MDBIcon fas icon="angle-up" size='lg'/>
        </MDBBtn>
      </MDBContainer>
      <Footer />
    </>
  )
}

export default StatisticsPage;