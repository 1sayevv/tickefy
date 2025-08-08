import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from '@/components/ProtectedRoute'
import AdminRoute from '@/components/AdminRoute'
import AdminRedirect from '@/components/AdminRedirect'
import SuperAdminRoute from '@/components/SuperAdminRoute'
import CustomerRoute from '@/components/CustomerRoute'
import HomeRedirect from '@/components/HomeRedirect'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import CreateTicket from '@/pages/CreateTicket'
import Admin from '@/pages/Admin'
import AdminTickets from '@/pages/AdminTickets'
import SuperAdminPanel from '@/pages/SuperAdminPanel'
import CreateCustomer from '@/pages/CreateCustomer'
import ManageUsers from '@/pages/ManageUsers'
import CreateUser from '@/pages/CreateUser'
import CreateRegularUser from '@/pages/CreateRegularUser'
import CustomerTickets from '@/pages/CustomerTickets'
import Profile from '@/pages/Profile'
import Test from '@/pages/Test'
import TestFileUpload from '@/pages/TestFileUpload'
import LanguageTest from '@/components/LanguageTest'
import NotFound from '@/pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/test" element={<Test />} />
      <Route path="/test-upload" element={<TestFileUpload />} />
      <Route path="/test-language" element={<LanguageTest />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <AdminRedirect>
            <Dashboard />
          </AdminRedirect>
        </ProtectedRoute>
      } />
      <Route path="/create-ticket" element={
        <ProtectedRoute>
          <AdminRedirect>
            <CreateTicket />
          </AdminRedirect>
        </ProtectedRoute>
      } />
      <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
      <Route path="/admin/tickets" element={<AdminRoute><AdminTickets /></AdminRoute>} />
      <Route path="/super-admin" element={<SuperAdminRoute><SuperAdminPanel /></SuperAdminRoute>} />
      <Route path="/customers/create" element={<SuperAdminRoute><CreateCustomer /></SuperAdminRoute>} />
      <Route path="/tickets" element={<CustomerRoute><CustomerTickets /></CustomerRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/users" element={<CustomerRoute><ManageUsers /></CustomerRoute>} />
      <Route path="/users/create" element={<CustomerRoute><CreateRegularUser /></CustomerRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App 