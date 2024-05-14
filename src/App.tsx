import { useEffect } from 'react';
import { Routes, Route, useNavigate} from 'react-router-dom';

import IndexRoutes from './containers/index';
import { AlertProvider } from './utils/notification/alertcontext';
import Alert from './utils/notification/alert';
import { fetchUser } from './utils/fetchUser';
import Login from './components/pages/login';


const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = fetchUser();
    
    if(!user) navigate('/login')
  }, [navigate]);

  return (
    <AlertProvider>
      <div className="App">
        <Alert />
        <Routes>
          <Route path="login" element={<Login/>} />
          <Route path="/*" element={<IndexRoutes/>} />
        </Routes>
      </div>
    </AlertProvider>
  )
}

export default App;
