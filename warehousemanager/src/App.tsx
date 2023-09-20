import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import TopNav from './components/TopNav'
import Home from './pages/Home'
import Warehouse from './pages/Warehouse'
import Company from './pages/Company'
import Item from './pages/Item'
import { useGetAllCompaniesQuery } from './api/companyApi'

function App() {
  
  const { data } = useGetAllCompaniesQuery();


  console.log(data);
  return (
    <>
      <BrowserRouter>
      <TopNav/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/company" element={<Company companyData = {data!} />}/>
        <Route path="/warehouse" element={<Warehouse companyData = {data!}/>} />
        <Route path="/item" element={<Item companyData = {data!} />} />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
