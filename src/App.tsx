import { Routes, Route} from 'react-router-dom';

import IndexRoutes from './containers/index';
import { AlertProvider } from './utils/notification/alertcontext';
import Alert from './utils/notification/alert';

const App = () => {
  return (
    <AlertProvider>
      <div className="App">
        <Alert />
        <Routes>
          <Route path="/*" element={<IndexRoutes/>} />
        </Routes>
      </div>
    </AlertProvider>
  )
}

export default App;
