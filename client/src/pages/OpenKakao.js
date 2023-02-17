import { useEffect } from "react";
import Loading from "../components/layout/Loading";

export default function OpenKakao() {
  useEffect(() => {
    window.location.replace('https://open.kakao.com/o/gPgSHvve');
  }, []);

  return <Loading />;
}