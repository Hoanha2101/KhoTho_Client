import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './Components/pages/App';
import About from './Components/pages/About';
import AboutLogin from './Components/pages/AboutLogin';
import Contact from './Components/pages/Contact';
import ContactLogin from './Components/pages/ContactLogin';
import Customer from './Components/pages/Customer';
import Jobs from './Components/pages/Jobs';
import Register from './Components/pages/RegisterPage/Register';  
import Login from './Components/pages/LoginPage/Login';
import ForgotPassword from './Components/pages/ForgotPasswordPage/ForgotPassword';
// import AdminDashboard from './Components/pages/Dashboard/AdminDashboard';  // Updated path
import CustomerDashboard from './Components/pages/Dashboard/CustomerDashboard';  // Updated path
import WorkerProfile from "./Components/pages/WorkerProfile/WorkerProfile"; //tested path
import UserManagement from './Components/pages/Dashboard/UserManagement';
import Dashboard from './Components/pages/Dashboard/Dashboard';  // Updated path
import WorkerManagement from './Components/pages/Dashboard/WorkerManagement';
import JobTypeManagement from './Components/pages/Dashboard/JobTypeManagement';
import ReviewManagement from './Components/pages/Dashboard/ReviewManagement';
import BookingManagement from './Components/pages/Dashboard/BookingManagement';
import WorkerScheduleManagement from './Components/pages/Dashboard/WorkerScheduleManagement';
import WorkerDashboard from './Components/pages/Dashboard/Worker/WorkDashboard';
import RegisterWorker from './Components/pages/RegisterWorker/RegisterWorker'
import OrderTracking from './Components/pages/OrderTracking/OrderTracking'
import Profile from './Components/pages/MyProfile/Profile';
import OrderManagement from './Components/pages/OrderManagement/OrderManagement';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/khotho" element={<Jobs />} /> 
        <Route path="/khotho/ordertracking" element={<OrderTracking />} />  
        <Route path="/khotho/ordermanagement" element={<OrderManagement />} />  
        <Route path="/khotho/jobs" element={<App />} />
        <Route path="/khotho/about" element={<About />} />
        <Route path="/khotho/aboutlogin" element={<AboutLogin />} />
        <Route path="/khotho/contact" element={<Contact />} />
        <Route path="/khotho/contactlogin" element={<ContactLogin />} />
        <Route path="/khotho/login" element={<Login />} />
        <Route path="/khotho/register" element={<Register />} />
        <Route path="/khotho/customer" element={<Customer />} />
        <Route path="/khotho/forgot-password" element={<ForgotPassword />} />
        {/* <Route path="/admindashboard" element={<AdminDashboard />} /> */}
        <Route path="/khotho/customerdashboard" element={<CustomerDashboard />} />  
        <Route path="/khotho/worker-profile/:workerId" element={<WorkerProfile />} />
        <Route path="/khotho/dashboard" element={<Dashboard />} />

        <Route path="/khotho/admin/usermanagement" element={<UserManagement />} />
        <Route path="/khotho/admin/customers" element={<CustomerDashboard />} />  
        <Route path="/khotho/admin/users" element={<UserManagement />} />  
        <Route path="/khotho/admin/workers" element={<WorkerManagement/>} />  
        <Route path="/khotho/admin/jobtypes" element={<JobTypeManagement />} />
        <Route path="/khotho/admin/reviews" element={<ReviewManagement />} />
        <Route path="/khotho/workers" element={<WorkerDashboard/>} />
        <Route path="/khotho/registerworker" element={<RegisterWorker/>} />
        <Route path="/khotho/ordertracking" element={<OrderTracking/>} />
        <Route path="/khotho/admin/bookings" element={<BookingManagement />} />
        <Route path="/khotho/admin/workerschedule" element={<WorkerScheduleManagement />} />
        <Route path="/workers" element={<WorkerDashboard/>} />
        
        <Route path="/khotho/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
