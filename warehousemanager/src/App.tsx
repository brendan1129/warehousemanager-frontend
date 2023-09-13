import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import TopNav from './components/TopNav'
import Home from './pages/Home'
import Warehouse from './pages/Warehouse'
import Company from './pages/Company'
import Item from './pages/Item'

function App() {

  return (
    <>
      <BrowserRouter>
      <TopNav/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/company" element={<Company/>} />
        <Route path="/warehouse" element={<Warehouse/>} />
        <Route path="/item" element={<Item/>} />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
