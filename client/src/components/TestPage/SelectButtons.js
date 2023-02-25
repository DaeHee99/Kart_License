import React, { useEffect, useState } from 'react';
import { MDBBtn, MDBIcon, MDBBadge } from 'mdb-react-ui-kit';
import mapData, { mapCount, mapAllCount } from './mapData';
import SearchModal from './SearchModal';

export default function SelectButtons(props) {
  const [selected, setSelected] = useState(undefined);
  const [outlineState, setOutlineState] = useState([
    true, true, true, true, true, true, true, true
  ]);
  const [buttonColor , setButtonColor] = useState("warning");
  const [searchModal, setSearchModal] = useState(false);

  const selectRecord = (i) => {
    let newOutline = [true, true, true, true, true, true, true, true];
    newOutline[i] = false;
    setOutlineState(newOutline);
    setSelected(i);
  }

  const prevHandler = () => props.prevMap(selected);
  const nextHandler = () => props.nextMap(selected);
  const mapSearch = (index) => props.mapSearch(index, selected);

  const buttonColorHandler = () => {
    if(props.num < mapCount.Rookie + 1) {
      setButtonColor("warning");
      return;
    }
    if(props.num < mapCount.Rookie + mapCount.L3 + 1) {
      setButtonColor("success");
      return;
    }
    if(props.num < mapCount.Rookie + mapCount.L3 + mapCount.L2 + 1) {
      setButtonColor("info");
      return;
    }
    else {
      setButtonColor("danger");
      return;
    }
  }

  useEffect(() => {
    setOutlineState([true, true, true, true, true, true, true, true]);
    setSelected(undefined);
    buttonColorHandler();

    if(Number.isInteger(props.nowSelect)) {
      selectRecord(props.nowSelect);
      return;
    }

    for(let i = 0; i < props.latestRecord.length; i++) {
      if(props.latestRecord[i].mapName === mapData[props.num-1].name) {
        selectRecord(props.latestRecord[i].select);
        break;
      }
    }
  }, [props.num])

  return (
    <div className='col-12 col-lg-10 mx-auto'>
      <div className="d-grid gap-3 mb-4">
        <MDBBtn outline={outlineState[0]} onClick={() => selectRecord(0)} rounded color={buttonColor}>
          <b>강주력 &nbsp; <MDBIcon fas icon="crown" /> &nbsp; {mapData[props.num-1].record[0]}</b>
        </MDBBtn>
        <MDBBtn outline={outlineState[1]} onClick={() => selectRecord(1)} rounded color={buttonColor}>
          <b>주력 &nbsp; <MDBIcon fas icon="crown" /> &nbsp; {mapData[props.num-1].record[1]}</b>
        </MDBBtn>
        <MDBBtn outline={outlineState[2]} onClick={() => selectRecord(2)} rounded color={buttonColor}>
          <b>1군 &nbsp; <MDBIcon fas icon="crown" /> &nbsp; {mapData[props.num-1].record[2]}</b>
        </MDBBtn>
        <MDBBtn outline={outlineState[3]} onClick={() => selectRecord(3)} rounded color={buttonColor}>
          <b>2군 &nbsp; <MDBIcon fas icon="crown" /> &nbsp; {mapData[props.num-1].record[3]}</b>
        </MDBBtn>
        <MDBBtn outline={outlineState[4]} onClick={() => selectRecord(4)} rounded color={buttonColor}>
          <b>3군 &nbsp; <MDBIcon fas icon="crown" /> &nbsp; {mapData[props.num-1].record[4]}</b>
        </MDBBtn>
        <MDBBtn outline={outlineState[5]} onClick={() => selectRecord(5)} rounded color={buttonColor}>
          <b>4군 &nbsp; <MDBIcon fas icon="crown" /> &nbsp; {mapData[props.num-1].record[5]}</b>
        </MDBBtn>
        <MDBBtn outline={outlineState[6]} onClick={() => selectRecord(6)} rounded color={buttonColor}>
          <b>일반 &nbsp; <MDBIcon fas icon="crown" /> &nbsp; {mapData[props.num-1].record[6]}</b>
        </MDBBtn>
        <MDBBtn outline={outlineState[7]} onClick={() => selectRecord(7)} rounded color='dark'>
          <b>선택 안함</b>
        </MDBBtn>
      </div>
      <div className="gap-2 d-flex justify-content-between">
        <MDBBtn className='px-2' color='secondary' onClick={prevHandler} disabled={props.num <= 1}>
          <MDBBadge><MDBIcon fas icon="arrow-left" /></MDBBadge><b style={{marginLeft:10}}>이전으로</b>
        </MDBBtn>
        <MDBBtn className='px-2' color='primary' outline onClick={()=>setSearchModal(true)}>
          <MDBIcon fas icon="search"/><b style={{marginLeft:10}}>트랙 검색</b>
        </MDBBtn>
        <MDBBtn className='px-2' color='secondary' onClick={nextHandler}>
          <b style={{marginRight:10}}>{mapAllCount===props.num ? "최종 결과" : "다음으로"}</b><MDBBadge><MDBIcon fas icon="arrow-right" /></MDBBadge>
        </MDBBtn>
      </div>
      <SearchModal searchModal={searchModal} setSearchModal={setSearchModal} mapSearch={mapSearch}/>
    </div>
  );
}