import { useState } from "react";
import {
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBContainer,
} from "mdb-react-ui-kit";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

function LoginPage() {
  const [loginRegisterActive, handleLoginRegisterClick] = useState("login");

  return (
    <MDBContainer className="col-md-6 mx-auto">
      <MDBTabs pills justify className="mt-4 mb-3">
        <MDBTabsItem>
          <MDBTabsLink
            onClick={() => handleLoginRegisterClick("login")}
            active={loginRegisterActive === "login"}
            className="fw-bold"
          >
            로그인
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink
            onClick={() => handleLoginRegisterClick("register")}
            active={loginRegisterActive === "register"}
            className="fw-bold"
          >
            회원가입
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>

      <MDBTabsContent>
        <MDBTabsPane show={loginRegisterActive === "login"}>
          <LoginForm handleLoginRegisterClick={handleLoginRegisterClick} />
        </MDBTabsPane>

        <MDBTabsPane show={loginRegisterActive === "register"}>
          <RegisterForm />
        </MDBTabsPane>
      </MDBTabsContent>
    </MDBContainer>
  );
}

export default LoginPage;
