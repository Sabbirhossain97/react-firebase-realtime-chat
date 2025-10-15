import './App.css'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Chat from './pages/Chat';
import useProfile from './hooks/useProfile';

function App() {
  const { user } = useProfile();
  console.log(user)
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  )
}

export default App
