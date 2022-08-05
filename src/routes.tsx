import { ErrorsLayout } from 'layouts/errors';
import NotFound from 'layouts/errors/views/NotFound';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DappLayout } from './layouts/dapp';
import { Home } from './layouts/dapp/Home';

export const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/dapp" element={<DappLayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="*" element={<ErrorsLayout/>}>
          <Route index element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
};
