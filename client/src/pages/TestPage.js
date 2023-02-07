import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  MDBContainer
} from 'mdb-react-ui-kit';
import mapImages from '../../src/components/TestPage/mapImages';
import Progress from '../components/TestPage/Progress';
import SelectButtons from '../components/TestPage/SelectButtons';
import mapData, { mapCount, mapAllCount, season } from '../components/TestPage/mapData';
import axios from 'axios';
import { API } from '../_actions/types';

function TestPage() {
  const userData = useSelector(state => state.user.userData);
  const navigation = useNavigate();
  const [num, setNum] = useState(1);
  const [selectList, setSelectList] = useState([undefined]);
  const [latestRecord, setLatestRecord] = useState([]);
  const [loading, setLoading] = useState(true);

  const collectData = (selected) => {
    let recordCount = [0, 0, 0, 0, 0, 0, 0, 0];
    let record = mapData.map((map, index) => {
      let selectRecord = selectList[index] === undefined ? selected : selectList[index]
      recordCount[selectRecord]++;
      return {
        mapName: map.name,
        select: selectRecord
      }
    })

    let body = {
      record : record,
      recordCount: recordCount,
      mapCount : mapCount,
      season : season
    }
    if(userData.isAuth) body.user = userData._id;

    axios.post(API+'/record/save', body, {withCredentials: true}).then(response => {
      navigation(`/result/${response.data.id}`, {replace: true});
    });
  }

  const setSelectItem = (selected) => {
    if(selected === undefined) selected = 7;
    let newList = [...selectList];
    newList[num-1] = selected;
    setSelectList(newList);
  }
  const nextMap = (selected) => {
    setSelectItem(selected);
    if(num < mapAllCount) setNum(num + 1);
    else collectData(selected);
  }
  const prevMap = (selected) => {
    setSelectItem(selected);
    if(num > 1) setNum(num - 1);
  }

  useEffect(() => {
    axios.post(API+'/record/latestRecord', {userId: userData.isAuth ? userData._id : ''}, {withCredentials: true}).then(response => {
      if(response.data.success && response.data.record !== null) setLatestRecord(response.data.record.record);
      setLoading(false);
    })
  }, [userData.isAuth, userData._id])
  
  return (
    loading ? <>로딩중</> :
    <MDBContainer>
      <Progress num={num}/>
      <img src={mapImages[num-1]} alt='mapImage' width={'100%'}/>
      <br /><br />
      <SelectButtons nextMap={nextMap} prevMap={prevMap} num={num} nowSelect={selectList[num]} latestRecord={latestRecord}/>
    </MDBContainer>
  )
}

export default TestPage;