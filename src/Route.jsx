import './App.css'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Chat from './pages/Chat';
import { PrivateRoute } from './components/auth/PrivateRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route element={<PrivateRoute />} >
        <Route path="/chat" element={<Chat />} />
      </Route>
    </Routes>
  )
}

export default App
