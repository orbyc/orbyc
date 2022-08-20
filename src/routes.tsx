import { AssetView } from "layouts/dapp/views/Asset";
import { ErrorsLayout } from "layouts/errors";
import NotFound from "layouts/errors/views/NotFound";
import { AssetExplorerView, ExplorerLayout } from "layouts/explorer";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { DappLayout } from "./layouts/dapp";
import { Home } from "./layouts/dapp/views/Home";

export const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="dapp" element={<DappLayout />}>
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
