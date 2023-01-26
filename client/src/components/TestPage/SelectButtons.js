import React, { useEffect, useState } from 'react';
import { MDBBtn, MDBIcon, MDBBadge } from 'mdb-react-ui-kit';
import mapData, { mapCount, mapAllCount } from './mapData';

export default function SelectButtons(props) {
  const [selected, setSelected] = useState(undefined);
  const [outlineState, setOutlineState] = useState([
    true, true, true, true, true, true, true
  ]);
  const [buttonColor , setButtonColor] = useState("warning")

  const selectRecord = (i) => {
    let newOutline = [true, true, true, true, true, true, true, true];
    newOutline[i] = false;
    setOutlineState(newOutline);
    setSelected(i);
  }

  const prevHandler = () => props.prevMap(selected);
  const nextHandler = () => props.nextMap(selected);

  const buttonColorHandler = () => {
    switch(props.num) {
      case mapCount.Rookie:
        setButtonColor("warning");
        break;
      case mapCount.Rookie + 1:
        setButtonColor("success");
        break;
      case mapCount.Rookie + mapCount.L3:
        setButtonColor("success");
        break;
      case mapCount.Rookie + mapCount.L3 + 1:
        setButtonColor("info");
        break;
      case mapCount.Rookie + mapCount.L3 + mapCount.L2:
        setButtonColor("info");
        break;
      case mapCount.Rookie + mapCount.L3 + mapCount.L2 + 1:
        setButtonColor("danger");
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    let newOutline = [true, true, true, true, true, true, true, true];
    if(Number.isInteger(props.nowSelect)) newOutline[props.nowSelect] = false;
    buttonColorHandler();
    setOutlineState(newOutline);
    setSelected(props.nowSelect);
  }, [props.num])

  return (
    <>
      <div className="d-grid gap-3 mb-4">
        <MDBBtn outline={outlineState[0]} onClick={() => selectRecord(0)} rounded color={buttonColor}>
          <b><MDBIcon fas icon="star" />강주력<MDBIcon fas icon="star" /> &nbsp; &nbsp; {mapData[props.num-1].record[0]}</b>
        </MDBBtn>
        <MDBBtn outline={outlineState[1]} onClick={() => selectRecord(1)} rounded color={buttonColor}>
          <b><MDBIcon fas icon="star" />주력<MDBIcon fas icon="star" /> &nbsp; &nbsp; {mapData[props.num-1].record[1]}</b>
        </MDBBtn>
        <MDBBtn outline={outlineState[2]} onClick={() => selectRecord(2)} rounded color={buttonColor}>
          <b><MDBIcon fas icon="star" />1군<MDBIcon fas icon="star" /> &nbsp; &nbsp; {mapData[props.num-1].record[2]}</b>
        </MDBBtn>
        <MDBBtn outline={outlineState[3]} onClick={() => selectRecord(3)} rounded color={buttonColor}>
          <b><MDBIcon fas icon="star" />2군<MDBIcon fas icon="star" /> &nbsp; &nbsp; {mapData[props.num-1].record[3]}</b>
        </MDBBtn>
        <MDBBtn outline={outlineState[4]} onClick={() => selectRecord(4)} rounded color={buttonColor}>
          <b><MDBIcon fas icon="star" />3군<MDBIcon fas icon="star" /> &nbsp; &nbsp; {mapData[props.num-1].record[4]}</b>
        </MDBBtn>
        <MDBBtn outline={outlineState[5]} onClick={() => selectRecord(5)} rounded color={buttonColor}>
          <b><MDBIcon fas icon="star" />4군<MDBIcon fas icon="star" /> &nbsp; &nbsp; {mapData[props.num-1].record[5]}</b>
        </MDBBtn>
        <MDBBtn outline={outlineState[6]} onClick={() => selectRecord(6)} rounded color={buttonColor}>
          <b><MDBIcon fas icon="star" />일반<MDBIcon fas icon="star" /> &nbsp; &nbsp; {mapData[props.num-1].record[6]}</b>
        </MDBBtn>
        <MDBBtn outline={outlineState[7]} onClick={() => selectRecord(7)} rounded color='dark'>
          <b>선택 안함</b>
        </MDBBtn>
      </div>
      <div className="gap-5 d-flex justify-content-between">
        <MDBBtn className='px-2' color='secondary' onClick={prevHandler} disabled={props.num <= 1}>
          <MDBBadge><MDBIcon fas icon="arrow-left" /></MDBBadge><b style={{marginLeft:10}}>이전으로</b>
        </MDBBtn>
        <MDBBtn className='px-2' color='secondary' onClick={nextHandler}>
          <b style={{marginRight:10}}>{mapAllCount===props.num ? "최종 결과" : "다음으로"}</b><MDBBadge><MDBIcon fas icon="arrow-right" /></MDBBadge>
        </MDBBtn>
      </div>
    </>
  );
}