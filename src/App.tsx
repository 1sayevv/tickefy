import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from '@/components/ProtectedRoute'
import AdminRoute from '@/components/AdminRoute'
import AdminRedirect from '@/components/AdminRedirect'
import SuperAdminRoute from '@/components/SuperAdminRoute'
import CustomerManagerRoute from '@/components/CustomerManagerRoute'
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
import CreateCustomerManager from '@/pages/CreateCustomerManager'
import ManageCustomerManagers from '@/pages/ManageCustomerManagers'
import CustomerManagerDashboard from '@/pages/CustomerManagerDashboard'
import CustomerManagerTickets from '@/pages/CustomerManagerTickets'
import CustomerTickets from '@/pages/CustomerTickets'
import Profile from '@/pages/Profile'
import Test from '@/pages/Test'
import TestFileUpload from '@/pages/TestFileUpload'
import LanguageTest from '@/components/LanguageTest'
import TicketHistoryPage from '@/pages/TicketHistoryPage'
import EditCustomerManager from '@/pages/EditCustomerManager'
import EditCustomer from '@/pages/EditCustomer'
import EditTicket from '@/pages/EditTicket'
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
      <Route path="/customer-managers" element={<SuperAdminRoute><ManageCustomerManagers /></SuperAdminRoute>} />
      <Route path="/customer-managers/create" element={<SuperAdminRoute><CreateCustomerManager /></SuperAdminRoute>} />
      <Route path="/customer-manager/dashboard" element={<CustomerManagerRoute><CustomerManagerDashboard /></CustomerManagerRoute>} />
      <Route path="/customer-manager/tickets" element={<CustomerManagerRoute><CustomerManagerTickets /></CustomerManagerRoute>} />
      <Route path="/tickets" element={<CustomerRoute><CustomerTickets /></CustomerRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/users" element={<CustomerRoute><ManageUsers /></CustomerRoute>} />
      <Route path="/users/create" element={<CustomerRoute><CreateRegularUser /></CustomerRoute>} />
      <Route path="/ticket/:ticketId/history" element={<AdminRoute><TicketHistoryPage /></AdminRoute>} />
      <Route path="/ticket/:ticketId/edit" element={<CustomerManagerRoute><EditTicket /></CustomerManagerRoute>} />
      <Route path="/customer-managers/:managerId/edit" element={<SuperAdminRoute><EditCustomerManager /></SuperAdminRoute>} />
      <Route path="/customers/:customerId/edit" element={<SuperAdminRoute><EditCustomer /></SuperAdminRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App 