import './App.css';
import WalletDashboard from './App/pages/WalletDashboard';
import Login from './App/pages/Login';
import {
	BrowserRouter as Router,
	Routes,
	Route
  } from "react-router-dom";

function App() {
  return (
	<Router>
    	<Routes>
			<Route path="/login" element={<Login />} />
	  		<Route path="/" element={<WalletDashboard />} />
    	</Routes>
	</Router>
  );
}

export default App;
