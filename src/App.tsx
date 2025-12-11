import { Provider } from 'react-redux';
import { store } from './store';

import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ApplicationFormWizardRoute, RedirectToStep } from './features/DynamicForm';

function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/apply" replace />} />
            <Route path="/apply" element={<RedirectToStep />} />
            <Route path="/apply/:stepId" element={<ApplicationFormWizardRoute />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
