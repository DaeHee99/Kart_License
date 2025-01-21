import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBRadio,
  MDBTextArea,
} from "mdb-react-ui-kit";
import { useSelector } from "react-redux";
import { API } from "../../../_actions/types";
import { season as nowSeason } from "../../../global/mapData";
import axios from "axios";

export default function SurveyModal({
  recordId,
  userId,
  recentSurvey,
  license,
  season,
}) {
  const user = useSelector((state) => state.user);
  const [scrollableModal, setScrollableModal] = useState(false);
  const [review, setReview] = useState("");

  const submitHandler = () => {
    const [level, balance] = [
      document
        .querySelector("input[type=radio][name=난이도]:checked")
        ?.id?.at(-1),
      document
        .querySelector("input[type=radio][name=밸런스]:checked")
        ?.id?.at(-1),
    ];

    if (!level) {
      alert("군표 난이도를 선택해주세요.");
      return;
    }
    if (!balance) {
      alert("군표 밸런스를 선택해주세요.");
      return;
    }

    const body = {
      license,
      level,
      balance,
      review,
      season,
      recordId,
      user: userId,
    };

    axios
      .post(API + "/survey/save", body, { withCredentials: true })
      .then((response) => {
        if (!response.data.success) return alert("제출 실패, 서버 오류");
        alert("제출 완료!\n소중한 피드백 감사합니다❤️");
        setScrollableModal(false);
      });
  };

  useEffect(() => {
    setTimeout(() => setScrollableModal(true), 1500);
  }, []);

  if (
    !user.userData?.isAuth ||
    user.userData?._id !== userId ||
    season !== nowSeason ||
    recentSurvey === nowSeason
  )
    return null;
  return (
    <>
      <MDBModal
        show={scrollableModal}
        setShow={setScrollableModal}
        tabIndex="-1"
      >
        <MDBModalDialog scrollable>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>S{nowSeason} 군표 피드백</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={() => setScrollableModal(!scrollableModal)}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <p className="text-center">
                안녕하세요. 카러플 군 계산기 운영진입니다.
                <br />
                이번 S{nowSeason} 군표 기록에 대한 피드백을 받고있습니다.
                <br />
                작성해주신 피드백은 다음 시즌에 반영할 예정입니다.
                <br />
                새로운 기능 관련 피드백은 현재 논의 중에 있습니다.
                <br />
                이용해주셔서 감사합니다 :)
              </p>
              <hr />
              <div>
                <label className="flex items-center mb-2 text-gray-600 text-sm font-medium">
                  1. 본인의 군을 체크해주세요.
                  <svg
                    width="7"
                    height="7"
                    viewBox="0 0 7 7"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ marginLeft: 5 }}
                  >
                    <path
                      d="M3.11222 6.04545L3.20668 3.94744L1.43679 5.08594L0.894886 4.14134L2.77415 3.18182L0.894886 2.2223L1.43679 1.2777L3.20668 2.41619L3.11222 0.318182H4.19105L4.09659 2.41619L5.86648 1.2777L6.40838 2.2223L4.52912 3.18182L6.40838 4.14134L5.86648 5.08594L4.09659 3.94744L4.19105 6.04545H3.11222Z"
                      fill="#EF4444"
                    ></path>
                  </svg>
                </label>
                <div
                  style={{
                    marginLeft: 10,
                    gap: 3,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <MDBRadio
                    disabled
                    label="강주력"
                    defaultChecked={license === "강주력"}
                  />
                  <MDBRadio
                    disabled
                    label="주력"
                    defaultChecked={license === "주력"}
                  />
                  <MDBRadio
                    disabled
                    label="1군"
                    defaultChecked={license === "1군"}
                  />
                  <MDBRadio
                    disabled
                    label="2군"
                    defaultChecked={license === "2군"}
                  />
                  <MDBRadio
                    disabled
                    label="3군"
                    defaultChecked={license === "3군"}
                  />
                  <MDBRadio
                    disabled
                    label="4군"
                    defaultChecked={license === "4군"}
                  />
                  <MDBRadio
                    disabled
                    label="일반"
                    defaultChecked={license === "일반"}
                  />
                </div>
              </div>
              <div style={{ marginTop: 20, marginBottom: 20 }}>
                <label className="flex items-center mb-2 text-gray-600 text-sm font-medium">
                  2. 이번 시즌 군표 난이도는 어떠셨나요?
                  <svg
                    width="7"
                    height="7"
                    viewBox="0 0 7 7"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ marginLeft: 5 }}
                  >
                    <path
                      d="M3.11222 6.04545L3.20668 3.94744L1.43679 5.08594L0.894886 4.14134L2.77415 3.18182L0.894886 2.2223L1.43679 1.2777L3.20668 2.41619L3.11222 0.318182H4.19105L4.09659 2.41619L5.86648 1.2777L6.40838 2.2223L4.52912 3.18182L6.40838 4.14134L5.86648 5.08594L4.09659 3.94744L4.19105 6.04545H3.11222Z"
                      fill="#EF4444"
                    ></path>
                  </svg>
                </label>
                <div
                  style={{
                    marginLeft: 10,
                    gap: 3,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <MDBRadio label="매우 쉬움" name="난이도" id="난이도1" />
                  <MDBRadio label="쉬움" name="난이도" id="난이도2" />
                  <MDBRadio label="보통" name="난이도" id="난이도3" />
                  <MDBRadio label="어려움" name="난이도" id="난이도4" />
                  <MDBRadio label="매우 어려움" name="난이도" id="난이도5" />
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label className="flex items-center mb-2 text-gray-600 text-sm font-medium">
                  3. 이번 시즌 맵 별로 군표 밸런스 어떠셨나요?
                  <svg
                    width="7"
                    height="7"
                    viewBox="0 0 7 7"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ marginLeft: 5 }}
                  >
                    <path
                      d="M3.11222 6.04545L3.20668 3.94744L1.43679 5.08594L0.894886 4.14134L2.77415 3.18182L0.894886 2.2223L1.43679 1.2777L3.20668 2.41619L3.11222 0.318182H4.19105L4.09659 2.41619L5.86648 1.2777L6.40838 2.2223L4.52912 3.18182L6.40838 4.14134L5.86648 5.08594L4.09659 3.94744L4.19105 6.04545H3.11222Z"
                      fill="#EF4444"
                    ></path>
                  </svg>
                </label>
                <div
                  style={{
                    marginLeft: 10,
                    gap: 3,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <MDBRadio label="매우 좋음" name="밸런스" id="밸런스1" />
                  <MDBRadio label="좋음" name="밸런스" id="밸런스2" />
                  <MDBRadio label="보통" name="밸런스" id="밸런스3" />
                  <MDBRadio label="나쁨" name="밸런스" id="밸런스4" />
                  <MDBRadio label="매우 나쁨" name="밸런스" id="밸런스5" />
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label className="flex items-center mb-2 text-gray-600 text-sm font-medium">
                  4. 그 외 의견 있으면 편하게 남겨주세요.
                </label>
                <div style={{ marginLeft: 10 }}>
                  <MDBTextArea
                    value={review}
                    onChange={(event) => setReview(event.target.value)}
                    label="자유롭게 작성"
                    rows={8}
                    style={{ resize: "none" }}
                  />
                </div>
              </div>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn
                color="secondary"
                onClick={() => setScrollableModal(!setScrollableModal)}
              >
                취소
              </MDBBtn>
              <MDBBtn onClick={submitHandler}>제출하기</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}
