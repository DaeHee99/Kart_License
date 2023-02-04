import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MDBContainer
} from 'mdb-react-ui-kit';
import { mapAllCount } from '../components/TestPage/mapData';
import mapImages from '../../src/components/TestPage/mapImages';
import Progress from '../components/TestPage/Progress';
import SelectButtons from '../components/TestPage/SelectButtons';

function TestPage() {
  const navigation = useNavigate();
  const [num, setNum] = useState(1);
  const [selectList, setSelectList] = useState([undefined]);

  const setSelectItem = (selected) => {
    let newList = [...selectList];
    newList[num] = selected;
    setSelectList(newList);
  }
  const nextMap = (selected) => {
    setSelectItem(selected);
    if(num < mapAllCount) setNum(num + 1);
    else navigation('/result/1', {replace: true});
  }
  const prevMap = (selected) => {
    setSelectItem(selected);
    if(num > 1) setNum(num - 1);
  }
  
  return (
    <MDBContainer>
      <Progress num={num}/>
      <img src={mapImages[num-1]} alt='mapImage' width={'100%'}/>
      <br /><br />
      <SelectButtons nextMap={nextMap} prevMap={prevMap} num={num} nowSelect={selectList[num]}/>
    </MDBContainer>
  )
}

export default TestPage;