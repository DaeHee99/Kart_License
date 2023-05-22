import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../../_actions/user_action";
import {
  MDBInput,
  MDBCheckbox,
  MDBBtn,
  // MDBIcon,
  MDBRadio,
  MDBCardImage,
} from "mdb-react-ui-kit";
import ProfileImages from "../layout/ProfileImages";

function RegisterForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [registerName, setRegisterName] = useState("");
  const [registerId, setRegisterId] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState("");

  const registerNameHandler = (event) => setRegisterName(event.target.value);
  const registerIdHandler = (event) => setRegisterId(event.target.value);
  const registerPasswordHandler = (event) =>
    setRegisterPassword(event.target.value);
  const registerPasswordConfirmHandler = (event) =>
    setRegisterPasswordConfirm(event.target.value);
  const registerSubmitHandler = (event) => {
    event.preventDefault();

    if (registerName.length > 16) return alert("닉네임은 최대 16글자 입니다.");
    if (registerId.length < 2)
      return alert("아이디는 최소 2자리로 입력해주세요");
    if (registerPassword !== registerPasswordConfirm)
      return alert("비밀번호를 다시 확인해주세요.");
    if (registerPassword.length < 4)
      return alert("비밀번호는 최소 4자리로 입력해주세요");
    if (!document.getElementById("Register_Agree").checked)
      return alert("회원가입에 동의해주세요.");

    let selected = document.querySelector(
      "input[type=radio][name=profileImage]:checked"
    );

    let body = {
      name: registerName,
      id: registerId,
      password: registerPassword,
      plainPassword: registerPassword,
      image: selected.value,
    };

    dispatch(registerUser(body)).then((response) => {
      if (response.payload.success) {
        alert("회원가입이 완료되었습니다.");
        navigate("/login", { replace: true });
      } else alert(response.payload.message || "회원가입 실패");
    });
  };

  return (
    <form onSubmit={registerSubmitHandler}>
      {/* <div className='text-center mb-3'>
        <p>소셜 로그인</p>

        <MDBBtn floating color="secondary" className='mx-1'>
          <MDBIcon fab icon='facebook-f' />
        </MDBBtn>

        <MDBBtn floating color="secondary" className='mx-1'>
          <MDBIcon fab icon='google' />
        </MDBBtn>

        <MDBBtn floating color="secondary" className='mx-1'>
          <MDBIcon fab icon='twitter' />
        </MDBBtn>

        <MDBBtn floating color="secondary" className='mx-1'>
          <MDBIcon fab icon='github' />
        </MDBBtn>
      </div>

      <p className='text-center'>OR</p> */}{" "}
      <br />
      <MDBInput
        className="mb-4"
        id="Register_Name"
        label="닉네임"
        value={registerName}
        onChange={registerNameHandler}
      />
      <MDBInput
        className="mb-4"
        id="Register_Id"
        label="아이디"
        value={registerId}
        onChange={registerIdHandler}
      />
      <MDBInput
        className="mb-4"
        type="password"
        id="Register_Password"
        label="비밀번호"
        value={registerPassword}
        onChange={registerPasswordHandler}
      />
      <MDBInput
        className="mb-4"
        type="password"
        id="Register_Confirm"
        label="비밀번호 확인"
        value={registerPasswordConfirm}
        onChange={registerPasswordConfirmHandler}
      />
      <div
        className="badge bg-primary text-wrap"
        style={{ width: "6rem", fontSize: "0.9rem", marginRight: "10px" }}
      >
        프로필 사진
      </div>
      원하는 프로필을 하나 선택하세요.
      <br />
      <br />
      <div className="d-flex flex-row justify-content-between flex-wrap">
        <MDBRadio
          name="profileImage"
          id="profileImage1"
          value={ProfileImages.dao}
          defaultChecked
          inline
          label={
            <MDBCardImage
              src={ProfileImages.dao}
              alt="ProfileImage"
              width="70px"
            />
          }
        />
        <MDBRadio
          name="profileImage"
          id="profileImage2"
          value={ProfileImages.bazzi}
          inline
          label={
            <MDBCardImage
              src={ProfileImages.bazzi}
              alt="ProfileImage"
              width="70px"
            />
          }
        />
        <MDBRadio
          name="profileImage"
          id="profileImage3"
          value={ProfileImages.dizini}
          inline
          label={
            <MDBCardImage
              src={ProfileImages.dizini}
              alt="ProfileImage"
              width="70px"
            />
          }
        />
        <MDBRadio
          name="profileImage"
          id="profileImage4"
          value={ProfileImages.marid}
          inline
          label={
            <MDBCardImage
              src={ProfileImages.marid}
              alt="ProfileImage"
              width="70px"
            />
          }
        />
        <MDBRadio
          name="profileImage"
          id="profileImage5"
          value={ProfileImages.eddi}
          inline
          label={
            <MDBCardImage
              src={ProfileImages.eddi}
              alt="ProfileImage"
              width="70px"
            />
          }
        />
        <MDBRadio
          name="profileImage"
          id="profileImage6"
          value={ProfileImages.kepi}
          inline
          label={
            <MDBCardImage
              src={ProfileImages.kepi}
              alt="ProfileImage"
              width="70px"
            />
          }
        />
        <MDBRadio
          name="profileImage"
          id="profileImage7"
          value={ProfileImages.rodumani}
          inline
          label={
            <MDBCardImage
              src={ProfileImages.rodumani}
              alt="ProfileImage"
              width="70px"
            />
          }
        />
        <MDBRadio
          name="profileImage"
          id="profileImage8"
          value={ProfileImages.uni}
          inline
          label={
            <MDBCardImage
              src={ProfileImages.uni}
              alt="ProfileImage"
              width="70px"
            />
          }
        />
      </div>
      <br />
      <MDBCheckbox
        wrapperClass="d-flex justify-content-center mb-4"
        id="Register_Agree"
        label="회원가입에 동의합니다."
        defaultChecked
      />
      <MDBBtn type="submit" className="mb-4" block>
        <b>회원가입</b>
      </MDBBtn>
    </form>
  );
}

export default RegisterForm;
