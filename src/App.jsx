import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar, Footer } from '@/layout'
import {
  HomePage,
  LoginPage,
  SignupPage,
  DashboardPage,
  PetsPage,
  VaccinationsPage,
  WeightPage,
  ScannerPage,
  ActivityPage,
  RecordsPage,
  DailyCarePage,
  RemindersPage,
  ProfilePage,
  ForgotPasswordPage,
  VerifyOTPPage,
  NewPasswordPage,
  NotificationsPage,
  PrivacyPage,
  TermsPage
} from '@/pages'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { ScrollToTop } from '@/components/ScrollToTop'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Pages with Navbar and Footer */}
        <Route path="/" element={
          <>
            <Navbar />
            <div className="min-h-screen bg-white">
              <HomePage />
            </div>
            <Footer />
          </>
        } />
        <Route path="/privacy" element={
          <>
            <Navbar />
            <PrivacyPage />
            <Footer />
          </>
        } />
        <Route path="/terms" element={
          <>
            <Navbar />
            <TermsPage />
            <Footer />
          </>
        } />

        {/* Auth Pages without Navbar/Footer */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<VerifyOTPPage />} />
        <Route path="/new-password" element={<NewPasswordPage />} />

        {/* Protected Routes - Require Authentication */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/pets" element={
          <ProtectedRoute>
            <PetsPage />
          </ProtectedRoute>
        } />
        <Route path="/weight" element={
          <ProtectedRoute>
            <WeightPage />
          </ProtectedRoute>
        } />
        <Route path="/vaccinations" element={
          <ProtectedRoute>
            <VaccinationsPage />
          </ProtectedRoute>
        } />
        <Route path="/activity" element={
          <ProtectedRoute>
            <ActivityPage />
          </ProtectedRoute>
        } />
        <Route path="/records" element={
          <ProtectedRoute>
            <RecordsPage />
          </ProtectedRoute>
        } />
        <Route path="/daily-care" element={
          <ProtectedRoute>
            <DailyCarePage />
          </ProtectedRoute>
        } />
        <Route path="/reminders" element={
          <ProtectedRoute>
            <RemindersPage />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/scanner" element={
          <ProtectedRoute>
            <ScannerPage />
          </ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        } />

        {/* 404 */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="text-8xl font-extrabold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent mb-4">404</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
              <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
              <a href="/" className="inline-flex items-center px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-200">
                Go Back Home
              </a>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
