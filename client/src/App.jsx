import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { applyMiddleware, legacy_createStore as createStore } from "redux";
import promiseMiddleware from "redux-promise";
import ReduxThunk from "redux-thunk";
import Reducer from "./_reducers/index";
import Router from "./Router";
import Header from "./components/Header";
import HealthCheck from "./components/HealthCheck";

const createStoreWithMiddleware = applyMiddleware(
  promiseMiddleware,
  ReduxThunk
)(createStore);

function App() {
  return (
    <Provider store={createStoreWithMiddleware(Reducer)}>
      <BrowserRouter>
        <Header />
        <Router />
      </BrowserRouter>
      <HealthCheck />
    </Provider>
  );
}

export default App;
