import { createStore } from 'redux';
import persistedReducer from "./rootReducer";
import { persistStore } from 'redux-persist';

const store = createStore(persistedReducer);
const persistor = persistStore(store);

export { store, persistor };