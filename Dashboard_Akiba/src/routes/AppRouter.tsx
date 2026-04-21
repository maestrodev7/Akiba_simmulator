import { BrowserRouter, Routes, Route } from 'react-router'
import Login from '../pages/login/Login'
import DemandList from '../pages/demand/DemandList'
import DemandDetail from '../pages/demand/DemandDetail'
import DashboardLayout from '../components/layout/DashboardLayout'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="" element={<DashboardLayout />}>
            <Route path="/demand" element={<DemandList />} />
            <Route path="/demand/:id" element={<DemandDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
