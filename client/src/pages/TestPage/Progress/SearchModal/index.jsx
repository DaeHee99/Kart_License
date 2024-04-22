import { useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBInput,
} from "mdb-react-ui-kit";
import mapData from "../../../../global/mapData";
import mapImages from "../../../../global/mapImages";

function SearchModal({ mapSearchHandler, searchModal, setSearchModal }) {
  const [keyWord, setKeyWord] = useState("");
  const searchHandler = (event) => {
    setKeyWord(event.target.value);
  };

  const searchClick = (index) => {
    mapSearchHandler(index);
    setSearchModal(false);
    setKeyWord("");
  };

  return (
    <MDBModal show={searchModal} setShow={setSearchModal} tabIndex="-1">
      <MDBModalDialog scrollable>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle className="fw-bold">트랙 검색</MDBModalTitle>
            <MDBBtn
              className="btn-close"
              color="none"
              onClick={() => setSearchModal(!searchModal)}
            ></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
            <div className="square border border-2 border-primary rounded-4">
              <ul className="my-2 me-2">
                <li>
                  <strong>
                    검색을 통해 원하는 트랙으로 바로 넘어갈 수 있습니다.
                  </strong>
                </li>
                <li>
                  <strong>
                    로그인 한 유저의 경우, 넘어간 트랙은 자동으로 가장 최근에
                    측정한 테스트에서 본인이 선택한 기록으로 자동 선택됩니다.
                  </strong>
                </li>
                <li>
                  <strong>
                    검색 창에 원하는 트랙의 이름을 키워드로 검색하세요.
                  </strong>
                </li>
              </ul>
            </div>
            <MDBInput
              className="my-4"
              type="text"
              id="mapSearchKeyword"
              label="트랙 이름"
              value={keyWord}
              onChange={searchHandler}
            />
            {mapData.map((item, index) => {
              if (keyWord !== "" && item.name.includes(keyWord)) {
                return (
                  <img
                    src={mapImages[index]}
                    alt="mapImage"
                    width={"100%"}
                    className="my-1"
                    style={{ cursor: "pointer" }}
                    onClick={() => searchClick(index)}
                    key={item.name}
                  />
                );
              }
            })}
          </MDBModalBody>
          <MDBModalFooter className="flex-row justify-content-between">
            <MDBBtn
              color="primary"
              className="fw-bold"
              style={{ width: "60%" }}
              onClick={() => searchClick(mapData.length - 1)}
            >
              마지막 트랙으로 바로가기
            </MDBBtn>
            <MDBBtn
              color="secondary"
              className="fw-bold"
              style={{ width: "35%" }}
              onClick={() => setSearchModal(!setSearchModal)}
            >
              닫기
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}

export default SearchModal;
