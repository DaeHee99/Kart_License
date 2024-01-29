import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MDBContainer } from "mdb-react-ui-kit";
import { API } from "../../_actions/types";
import axios from "axios";
import Loading from "../../components/Loading";
import Footer from "../../components/Footer";
import mapData, { mapCount, mapAllCount, season } from "../../global/mapData";
import mapImages from "../../global/mapImages";
import Progress from "./Progress";
import SelectButtons from "./SelectButtons";

function TestPage() {
  const userData = useSelector((state) => state.user.userData);
  const navigation = useNavigate();
  const [num, setNum] = useState(1);
  const [selectList, setSelectList] = useState([undefined]);
  const [latestRecord, setLatestRecord] = useState([]);
  const [loading, setLoading] = useState(true);

  const collectData = (selected) => {
    let recordCount = [0, 0, 0, 0, 0, 0, 0, 0];
    let record = mapData.map((map, index) => {
      let selectRecord =
        index + 1 === mapData.length ? selected : selectList[index];
      recordCount[selectRecord]++;
      return {
        mapName: map.name,
        select: selectRecord,
      };
    });

    const body = {
      record: record,
      recordCount: recordCount,
      mapCount: mapCount,
      season: season,
    };
    if (userData.isAuth) body.user = userData._id;

    axios
      .post(API + "/record/save", body, { withCredentials: true })
      .then((response) => {
        setTimeout(
          () => navigation(`/result/${response.data.id}`, { replace: true }),
          1500
        );
      });
  };

  const setSelectItem = (selected) => {
    if (selected === undefined) selected = 7;
    let newList = [...selectList];
    newList[num - 1] = selected;
    setSelectList(newList);
  };
  const nextMap = (selected) => {
    setSelectItem(selected);
    if (num < mapAllCount) setNum(num + 1);
    else {
      collectData(selected);
      setLoading(true);
    }
  };
  const prevMap = (selected) => {
    setSelectItem(selected);
    if (num > 1) setNum(num - 1);
  };

  const mapSearch = async (index, selected) => {
    if (index + 1 <= num) {
      setSelectItem(selected);
      setNum(index + 1);
    } else {
      setLoading(true);
      let newList = [...selectList];
      newList[num - 1] = selected !== undefined ? selected : 7;

      for (let i = num + 1; i < index + 1; i++) {
        setNum(i);
        let select = selectList[i - 1] !== undefined ? selectList[i - 1] : 7;
        if (latestRecord.length > 0) {
          await Promise.all(
            latestRecord.map(async (params) => {
              if (params.mapName === mapData[i - 1].name) {
                select = params.select;
              }
            })
          );
        }
        newList[i - 1] = select;
      }

      setSelectList(newList);
      setNum(index + 1);
      setLoading(false);
    }
  };

  useEffect(() => {
    axios
      .post(
        API + "/record/latestRecord",
        { userId: userData.isAuth ? userData._id : "" },
        { withCredentials: true }
      )
      .then((response) => {
        if (response.data.success && response.data.record !== null)
          setLatestRecord(response.data.record.record);
        setLoading(false);
      });
  }, [userData.isAuth, userData._id]);

  if (loading) return <Loading />;
  return (
    <>
      <MDBContainer className="mb-5">
        <Progress num={num} />
        <div className="text-center mb-3">
          <img
            src={mapImages[num - 1]}
            alt="mapImage"
            className="col-12 col-lg-10"
          />
        </div>
        <SelectButtons
          nextMap={nextMap}
          prevMap={prevMap}
          num={num}
          mapSearch={mapSearch}
          nowSelect={selectList[num - 1]}
          latestRecord={latestRecord}
        />
      </MDBContainer>
      <Footer />
    </>
  );
}

export default TestPage;
