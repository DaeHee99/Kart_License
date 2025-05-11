import { memo, useCallback, useEffect, useRef, useState } from "react";
import { API } from "../../_actions/types";
import axios from "axios";
import NewVersionModal from "./NewVersionModal";
import ServerErrorModal from "./ServerErrorModal";

function HealthCheck() {
  const versionRef = useRef(null);
  const [showNewVersion, setShowNewVersion] = useState(false);
  const [showServerError, setShowServerError] = useState(false);

  const checkPing = useCallback(() => {
    // 브라우저 탭이 비활성화 -> ping 날리지 않기기
    if (document.visibilityState === "hidden") return;

    axios
      .get(API.replace("/api", "") + "/ping", { withCredentials: true })
      .then((response) => {
        const { version } = response.data;

        // 현재 앱이 최신 버전이 아닐 경우
        if (versionRef.current && versionRef.current !== version) {
          setShowNewVersion(true);
        }

        versionRef.current = version;
      })
      .catch(() => {
        // ping 응답이 없는 경우, 서버 에러가 발생하는 경우 (서버 통신 문제)
        setShowServerError(true);
      });
  }, []);

  useEffect(() => {
    checkPing();
    const intervalId = setInterval(checkPing, 10000);

    return () => clearInterval(intervalId);
  }, [checkPing]);

  return (
    <>
      <NewVersionModal
        showModal={showNewVersion}
        setModal={setShowNewVersion}
      />
      <ServerErrorModal
        showModal={showServerError}
        setModal={setShowServerError}
      />
    </>
  );
}

export default memo(HealthCheck);
