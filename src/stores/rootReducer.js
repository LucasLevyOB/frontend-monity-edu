import { combineReducers } from "redux";
import authReducer from "./authReducer";
import { persistReducer } from "redux-persist";
import persistConfig from "./persistConfig";

const rootReducer = combineReducers({
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;