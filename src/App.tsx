import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from '@/components/ProtectedRoute'
import AdminRoute from '@/components/AdminRoute'
import AdminRedirect from '@/components/AdminRedirect'
import HomeRedirect from '@/components/HomeRedirect'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import CreateTicket from '@/pages/CreateTicket'
import Admin from '@/pages/Admin'
import AdminTickets from '@/pages/AdminTickets'
import Test from '@/pages/Test'
import TestFileUpload from '@/pages/TestFileUpload'
import LanguageTest from '@/components/LanguageTest'

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
    </Routes>
  )
}

export default App 