import { AssetView } from "layouts/dapp/views/asset";
import { ErrorsLayout } from "layouts/errors";
import { AssetExplorerView, ExplorerLayout } from "layouts/explorer";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { DappLayout } from "./layouts/dapp";
import { Home } from "./layouts/dapp/views/dashboard";

export const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="browser" element={<DappLayout />}>
          <Route index element={<Home />} />
          <Route path=":id" element={<AssetView />} />
        </Route>
        <Route path="/" element={<ExplorerLayout />}>
          <Route path=":id" element={<AssetExplorerView />} />
        </Route>
        <Route path="*" element={<ErrorsLayout />}>
          <Route index element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
};

const NotFound = () => <Navigate to="/browser" />;
