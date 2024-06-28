import { useEffect, useState } from "react";
import {
  MDBProgress,
  MDBProgressBar,
  MDBBadge,
  MDBBtn,
  MDBIcon,
} from "mdb-react-ui-kit";
import { mapCount, mapAllCount } from "../../../global/mapData";
import ShareToast from "./ShareToast";
import SearchModal from "./SearchModal";

const computeLength = (value) => (value / mapAllCount) * 100;

function Progress({ num, mapSearch, selected }) {
  const [showShareToast, setShowShareToast] = useState(false);
  const [searchModal, setSearchModal] = useState(false);
  const [barLength, setBarLength] = useState({
    Lookie: 0,
    L3: 0,
    L2: 0,
    L1: 0,
  });

  const mapSearchHandler = (index) => mapSearch(index, selected);

  useEffect(() => {
    setBarLength({
      Lookie:
        num > mapCount.Rookie
          ? computeLength(mapCount.Rookie)
          : computeLength(num) < 0
          ? 0
          : computeLength(num),
      L3:
        num > mapCount.Rookie + mapCount.L3
          ? computeLength(mapCount.L3)
          : computeLength(num - mapCount.Rookie) < 0
          ? 0
          : computeLength(num - mapCount.Rookie),
      L2:
        num > mapCount.Rookie + mapCount.L3 + mapCount.L2
          ? computeLength(mapCount.L2)
          : computeLength(num - mapCount.Rookie - mapCount.L3) < 0
          ? 0
          : computeLength(num - mapCount.Rookie - mapCount.L3),
      L1:
        num > mapCount.Rookie + mapCount.L3 + mapCount.L2 + mapCount.L1
          ? computeLength(mapCount.L1)
          : computeLength(num - mapCount.Rookie - mapCount.L3 - mapCount.L2) < 0
          ? 0
          : computeLength(num - mapCount.Rookie - mapCount.L3 - mapCount.L2),
    });
  }, [num]);

  return (
    <>
      <MDBProgress height="15">
        <MDBProgressBar
          animated
          striped
          bgColor="warning"
          width={barLength.Lookie}
          valuemin={0}
          valuemax={100}
        />
        <MDBProgressBar
          animated
          striped
          bgColor="success"
          width={barLength.L3}
          valuemin={0}
          valuemax={100}
        />
        <MDBProgressBar
          animated
          striped
          bgColor="info"
          width={barLength.L2}
          valuemin={0}
          valuemax={100}
        />
        <MDBProgressBar
          animated
          striped
          bgColor="danger"
          width={barLength.L1}
          valuemin={0}
          valuemax={100}
        />
      </MDBProgress>
      <div className="text-center my-3 fs-4 col-12 col-lg-10 mx-auto position-relative">
        <MDBBtn
          className="px-2 position-absolute"
          color="primary"
          outline
          onClick={() => setShowShareToast(true)}
          style={{ top: 0, left: 0 }}
        >
          <MDBIcon fas icon="share-square" />
          <span className="fw-bold" style={{ marginLeft: 10 }}>
            트랙 공유
          </span>
        </MDBBtn>
        <MDBBadge className="fw-bold">
          {num} / {mapAllCount}
        </MDBBadge>
        <MDBBtn
          className="px-2 position-absolute"
          color="primary"
          outline
          onClick={() => setSearchModal(true)}
          style={{ top: 0, right: 0 }}
        >
          <MDBIcon fas icon="search" />
          <span className="fw-bold" style={{ marginLeft: 10 }}>
            트랙 검색
          </span>
        </MDBBtn>
      </div>

      <ShareToast
        num={num}
        showToast={showShareToast}
        setShowToast={setShowShareToast}
      />
      <SearchModal
        searchModal={searchModal}
        setSearchModal={setSearchModal}
        mapSearchHandler={mapSearchHandler}
      />
    </>
  );
}

export default Progress;
