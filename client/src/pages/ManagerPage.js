import React, { useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBContainer,
  MDBBtn,
  MDBIcon,
  MDBTypography,
  MDBInput
} from 'mdb-react-ui-kit';
import Footer from '../components/layout/Footer';
import UserTable from '../components/ManagerPage/UserTable';
import LogTable from '../components/ManagerPage/LogTable';
import RecordTable from '../components/ManagerPage/RecordTable';
import StarTable from '../components/ManagerPage/StarTable';
import Pagination from '../components/ManagerPage/Pagination';

export default function ManagerPage() {
  const navigation = useNavigate();
  const [searchParams] = useSearchParams();
  const [tab] = useState(searchParams.get("tab") || 'record');
  const [page] = useState(Number(searchParams.get("page")) || 1);
  const [dataAllCount, setDataAllCount] = useState(0);
  const [viewPageNavigation, setViewPageNavigation] = useState(false);

  const [userSearchName, setUserSearchName] = useState('');
  const [userSearchResetButton, setUserSearchResetButton] = useState(false);
  const userSearchHangler = (event) => setUserSearchName(event.target.value);
  const userRef = useRef({});
  const userSearch = () => {
    setUserSearchResetButton(true);
    userRef.current.userSearch(userSearchName);
  }
  const userSearchReset = () => window.location.reload();

  const tabToKorean = () => {
    if(tab === 'record') return '기록';
    if(tab === 'user') return '유저';
    if(tab === 'star') return '후기';
    if(tab === 'log') return '로그';
  }

  return (
    <>
      <MDBContainer className='mb-7'>
        <MDBTabs pills justify className='mb-3'>
          <MDBTabsItem>
            <MDBTabsLink
              className='py-3 px-0'
              onClick={() => navigation('/manager?tab=record&page=1')}
              active={tab === 'record'}
            >
              <b>실시간 기록</b>
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink
              className='py-3 px-0'
              onClick={() => navigation('/manager?tab=user&page=1')}
              active={tab === 'user'}
            >
              <b>전체 유저</b>
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink
              className='py-3 px-0'
              onClick={() => navigation('/manager?tab=star&page=1')}
              active={tab === 'star'}
            >
              <b>후기</b>
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink
              className='py-3 px-0'
              onClick={() => navigation('/manager?tab=log&page=1')}
              active={tab === 'log'}
            >
              <b>로그</b>
            </MDBTabsLink>
          </MDBTabsItem>
        </MDBTabs>

        {tab === 'user' &&
        <div className='d-flex flex-row justify-content-end mb-2'>
          <MDBInput type='text' id='userSearchKeyword' label='유저 검색' value={userSearchName} onChange={userSearchHangler}/>
          <MDBBtn color='primary' className='fw-bold' style={{width: '20%', maxWidth: 100, marginLeft: 2}} onClick={userSearch}>검색</MDBBtn>
          {userSearchResetButton && <MDBBtn color='secondary' className='fw-bold' style={{width: '20%', maxWidth: 100, marginLeft: 2}} onClick={userSearchReset}>리셋</MDBBtn>}
        </div>
        }

        {dataAllCount > 0 &&
        <MDBTypography listUnStyled className='mb-0 text-end'>
          <MDBIcon icon='check-circle' className='me-2 text-success' />{dataAllCount}개의 {tabToKorean()} 데이터가 있습니다!
        </MDBTypography>
        }
        
        <MDBTabsContent>
          <MDBTabsPane show={tab === 'record'}>
            <RecordTable tab={tab} page={page} setDataAllCount={setDataAllCount} setViewPageNavigation={setViewPageNavigation}/>
          </MDBTabsPane>

          <MDBTabsPane show={tab === 'user'}>
            <UserTable tab={tab} page={page} setDataAllCount={setDataAllCount} setViewPageNavigation={setViewPageNavigation} ref={userRef}/>
          </MDBTabsPane>

          <MDBTabsPane show={tab === 'star'}>
            <StarTable tab={tab} page={page} setDataAllCount={setDataAllCount} setViewPageNavigation={setViewPageNavigation}/>
          </MDBTabsPane>

          <MDBTabsPane show={tab === 'log'}>
            <LogTable tab={tab} page={page} setDataAllCount={setDataAllCount} setViewPageNavigation={setViewPageNavigation}/>
          </MDBTabsPane>
        </MDBTabsContent>
        
        {viewPageNavigation && <Pagination tab={tab} page={page} lastPage={Math.ceil(dataAllCount / 20)}/>}

        <MDBBtn size='lg' floating style={{ position: 'fixed', top: '90%', right: '50%', marginRight: '-45%', zIndex: '99' }} onClick={()=>window.scrollTo({top: 0, behavior: 'smooth'})}>
          <MDBIcon fas icon="angle-up" size='lg'/>
        </MDBBtn>
      </MDBContainer>
      <Footer />
    </>
  );
}