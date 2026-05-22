import { BrowserRouter, Routes, Route } from 'react-router'
import Login from '../pages/login/Login.tsx'
import DemandList from '../pages/demand/DemandList.tsx'
import DemandDetail from '../pages/demand/DemandDetail.tsx'
import PaymentSettings from '../pages/settings/PaymentSettings.tsx'
import DashboardLayout from '../components/layout/DashboardLayout.tsx'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="" element={<DashboardLayout />}>
            <Route path="/demand" element={<DemandList />} />
            <Route path="/demand/:id" element={<DemandDetail />} />
            <Route path="/settings/payment" element={<PaymentSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
