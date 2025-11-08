import { ReactNode } from "react";
import ReactDOM from "react-dom";

interface IPortalProps {
  children: ReactNode;
}

export default function Portal({ children }: IPortalProps) {
  const element =
    typeof window !== "undefined" && document.querySelector(`#portal`);

  return element && children ? ReactDOM.createPortal(children, element) : null;
}
