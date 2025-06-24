import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ChakraProvider } from './components/ui/provider.jsx';
import { RouterProvider } from 'react-router-dom';
import router from './routes/router.jsx';
import { store, persistor } from './stores';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from './components/ui/toaster.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RouterProvider router={router} />
          <Toaster />
        </PersistGate>
      </Provider>
    </ChakraProvider>
  </StrictMode>,
);
