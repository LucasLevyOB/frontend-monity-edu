import { combineReducers } from "redux";
import authReducer from "./authReducer";
import { contadorReducer } from "./contadorReducer";
import { persistReducer } from "redux-persist";
import persistConfig from "./persistConfig";

const rootReducer = combineReducers({
  auth: authReducer,
  contador: contadorReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;