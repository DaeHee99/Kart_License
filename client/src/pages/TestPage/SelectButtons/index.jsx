import { useEffect, useState } from "react";
import { MDBBtn, MDBIcon, MDBBadge } from "mdb-react-ui-kit";
import mapData, { mapCount, mapAllCount } from "../../../global/mapData";
import SearchModal from "./SearchModal";

function SelectButtons({
  num,
  nowSelect,
  latestRecord,
  prevMap,
  nextMap,
  mapSearch,
}) {
  const [selected, setSelected] = useState(undefined);
  const [outlineState, setOutlineState] = useState([
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ]);
  const [buttonColor, setButtonColor] = useState("warning");
  const [searchModal, setSearchModal] = useState(false);

  const selectRecord = (i) => {
    let newOutline = [true, true, true, true, true, true, true, true];
    newOutline[i] = false;
    setOutlineState(newOutline);
    setSelected(i);
  };

  const prevHandler = () => prevMap(selected);
  const nextHandler = () => nextMap(selected);
  const mapSearchHandler = (index) => mapSearch(index, selected);

  const buttonColorHandler = () => {
    if (num < mapCount.Rookie + 1) {
      setButtonColor("warning");
      return;
    }
    if (num < mapCount.Rookie + mapCount.L3 + 1) {
      setButtonColor("success");
      return;
    }
    if (num < mapCount.Rookie + mapCount.L3 + mapCount.L2 + 1) {
      setButtonColor("info");
      return;
    } else {
      setButtonColor("danger");
      return;
    }
  };

  useEffect(() => {
    setOutlineState([true, true, true, true, true, true, true, true]);
    setSelected(undefined);
    buttonColorHandler();

    if (Number.isInteger(nowSelect)) {
      selectRecord(nowSelect);
      return;
    }

    for (let i = 0; i < latestRecord.length; i++) {
      if (latestRecord[i].mapName === mapData[num - 1].name) {
        selectRecord(latestRecord[i].select);
        break;
      }
    }
  }, [num]);

  return (
    <div className="col-12 col-lg-10 mx-auto">
      <div className="d-grid gap-3 mb-4">
        <MDBBtn
          outline={outlineState[0]}
          onClick={() => selectRecord(0)}
          rounded
          color={buttonColor}
        >
          <b>
            강주력 &nbsp; <MDBIcon fas icon="crown" /> &nbsp;{" "}
            {mapData[num - 1].record[0]}
          </b>
        </MDBBtn>
        <MDBBtn
          outline={outlineState[1]}
          onClick={() => selectRecord(1)}
          rounded
          color={buttonColor}
        >
          <b>
            주력 &nbsp; <MDBIcon fas icon="crown" /> &nbsp;{" "}
            {mapData[num - 1].record[1]}
          </b>
        </MDBBtn>
        <MDBBtn
          outline={outlineState[2]}
          onClick={() => selectRecord(2)}
          rounded
          color={buttonColor}
        >
          <b>
            1군 &nbsp; <MDBIcon fas icon="crown" /> &nbsp;{" "}
            {mapData[num - 1].record[2]}
          </b>
        </MDBBtn>
        <MDBBtn
          outline={outlineState[3]}
          onClick={() => selectRecord(3)}
          rounded
          color={buttonColor}
        >
          <b>
            2군 &nbsp; <MDBIcon fas icon="crown" /> &nbsp;{" "}
            {mapData[num - 1].record[3]}
          </b>
        </MDBBtn>
        <MDBBtn
          outline={outlineState[4]}
          onClick={() => selectRecord(4)}
          rounded
          color={buttonColor}
        >
          <b>
            3군 &nbsp; <MDBIcon fas icon="crown" /> &nbsp;{" "}
            {mapData[num - 1].record[4]}
          </b>
        </MDBBtn>
        <MDBBtn
          outline={outlineState[5]}
          onClick={() => selectRecord(5)}
          rounded
          color={buttonColor}
        >
          <b>
            4군 &nbsp; <MDBIcon fas icon="crown" /> &nbsp;{" "}
            {mapData[num - 1].record[5]}
          </b>
        </MDBBtn>
        <MDBBtn
          outline={outlineState[6]}
          onClick={() => selectRecord(6)}
          rounded
          color={buttonColor}
        >
          <b>
            일반 &nbsp; <MDBIcon fas icon="crown" /> &nbsp;{" "}
            {mapData[num - 1].record[6]}
          </b>
        </MDBBtn>
        <MDBBtn
          outline={outlineState[7]}
          onClick={() => selectRecord(7)}
          rounded
          color="dark"
        >
          <b>선택 안함</b>
        </MDBBtn>
      </div>
      <div className="gap-2 d-flex justify-content-between">
        <MDBBtn
          className="px-2"
          color="secondary"
          onClick={prevHandler}
          disabled={num <= 1}
        >
          <MDBBadge>
            <MDBIcon fas icon="arrow-left" />
          </MDBBadge>
          <b style={{ marginLeft: 10 }}>이전으로</b>
        </MDBBtn>
        <MDBBtn
          className="px-2"
          color="primary"
          outline
          onClick={() => setSearchModal(true)}
        >
          <MDBIcon fas icon="search" />
          <b style={{ marginLeft: 10 }}>트랙 검색</b>
        </MDBBtn>
        <MDBBtn className="px-2" color="secondary" onClick={nextHandler}>
          <b style={{ marginRight: 10 }}>
            {mapAllCount === num ? "최종 결과" : "다음으로"}
          </b>
          <MDBBadge>
            <MDBIcon fas icon="arrow-right" />
          </MDBBadge>
        </MDBBtn>
      </div>
      <SearchModal
        searchModal={searchModal}
        setSearchModal={setSearchModal}
        mapSearchHandler={mapSearchHandler}
      />
    </div>
  );
}

export default SelectButtons;
