import storage from 'redux-persist/lib/storage'; // ou sessionStorage

const persistConfig = {
  key: 'root', // Chave única para o seu armazenamento
  storage, // Usando localStorage
  whitelist: ['auth'], // Opcional: persista apenas certos reducers
  // blacklist: ['outroReducer'], // Opcional: não persista certos reducers
};

export default persistConfig;