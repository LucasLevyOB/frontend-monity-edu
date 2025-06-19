// Ações
const INCREMENTAR = 'INCREMENTAR';
const DECREMENTAR = 'DECREMENTAR';

// Ação para incrementar
export const incrementar = () => ({
  type: INCREMENTAR,
});

// Ação para decrementar
export const decrementar = () => ({
  type: DECREMENTAR,
});

// Redutor
export const contadorReducer = (state = 0, action) => {
  switch (action.type) {
    case INCREMENTAR:
      return state + 1;
    case DECREMENTAR:
      return state - 1;
    default:
      return state;
  }
};