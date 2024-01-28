import { useEffect, useState } from "react";
import { MDBProgress, MDBProgressBar, MDBBadge } from "mdb-react-ui-kit";
import { mapCount, mapAllCount } from "../../../global/mapData";

const computeLength = (value) => (value / mapAllCount) * 100;

function Progress({ num }) {
  const [barLength, setBarLength] = useState({
    Lookie: 0,
    L3: 0,
    L2: 0,
    L1: 0,
  });

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
      <div className="text-center mt-2 mb-3 fs-4">
        <MDBBadge>
          {num} / {mapAllCount}
        </MDBBadge>
      </div>
    </>
  );
}

export default Progress;
