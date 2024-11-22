import React, { useRef } from "react";
import ReactDOM from "react-dom/client";
import AccountExists from "./AccountForm/AccountExists";
import CreateNew from "./AccountForm/CreateNew";

import "./style/style.css";

const Login = () => {
  const formId = "login-form";
  const modeId = "login-mode";
  const negativeSpan = "negative";

  let mode = useRef(true);

  let formRoot : React.MutableRefObject<ReactDOM.Root|null> = useRef(null);

  return (
    <div>
      <form id={formId} onSubmit={(e) => {e.preventDefault();}}>
        {mode.current ? <AccountExists formId={formId}/> : <CreateNew formId={formId} />}
      </form>
      <div className="flex flex-row ">
        <p className="mr-1">If you <span id="negative">do not</span> have an account then</p>
        <a id={modeId} onClick={(e) => {
          e.preventDefault();

          if (!formRoot.current) {
            formRoot.current = ReactDOM.createRoot(document.getElementById(formId)!);
          }

          mode.current = !mode.current;
          if (mode.current) {
            formRoot.current.render(<AccountExists formId={formId} />);
          } else {
            formRoot.current.render(<CreateNew formId={formId} />);
          }

          const statement = document.getElementById(negativeSpan)!;
          const anchorMode = document.getElementById(modeId)!;

          if (mode.current) {
            anchorMode.textContent = "Sign up";
          } else {
            statement.textContent = "do not";
            anchorMode.textContent = "Login";
          }

        }}>Sign up</a>
      </div>
    </div>
  );
}

export default Login;