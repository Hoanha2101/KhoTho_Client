// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
// import { useNavigate } from 'react-router-dom';

// const AdminDashboard = () => {
//   const [activeView, setActiveView] = useState('dashboard');
//   const [jobTypes, setJobTypes] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [workers, setWorkers] = useState([]);
//   const [workerJobTypes, setWorkerJobTypes] = useState([]);
//   const [reviews, setReviews] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [searchEmail, setSearchEmail] = useState('');
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     phoneNumber: '',
//     address: '',
//     userType: 0,
//     profilePicture: ''
//   });
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const handleNavigation = (path) => {
//     if (path === 'users') {
//       navigate('/usermanagement');
//     } else {
//       setActiveView(path);
//     }
//   };

//   const fetchDashboardData = async () => {
//     try {
//       const [jobTypesRes, usersRes, workersRes, workerJobTypesRes, reviewsRes] = await Promise.all([
//         axios.get('https://localhost:7062/api/JobTypes'),
//         axios.get('https://localhost:7062/api/Users'),
//         axios.get('https://localhost:7062/api/Workers'),
//         axios.get('https://localhost:7062/api/WorkerJobTypes'),
//         axios.get('https://localhost:7062/api/Reviews')
//       ]);

//       setJobTypes(jobTypesRes.data);
//       setUsers(usersRes.data);
//       setWorkers(workersRes.data);
//       setWorkerJobTypes(workerJobTypesRes.data);
//       setReviews(reviewsRes.data);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   // User Management Functions
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (selectedUser) {
//         await axios.put(`https://localhost:7062/api/Users/${selectedUser.userId}`, {
//           ...formData,
//           userId: selectedUser.userId,
//           createdAt: new Date().toISOString()
//         });
//       } else {
//         await axios.post('https://localhost:7062/api/Users', {
//           ...formData,
//           userId: 0,
//           createdAt: new Date().toISOString()
//         });
//       }
//       setIsModalOpen(false);
//       setSelectedUser(null);
//       resetForm();
//       fetchDashboardData();
//     } catch (error) {
//       console.error('Error saving user:', error);
//     }
//   };

//   const handleDelete = async (userId) => {
//     if (window.confirm('Are you sure you want to delete this user?')) {
//       try {
//         await axios.delete(`https://localhost:7062/api/Users/${userId}`);
//         fetchDashboardData();
//       } catch (error) {
//         console.error('Error deleting user:', error);
//       }
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       fullName: '',
//       email: '',
//       phoneNumber: '',
//       address: '',
//       userType: 0,
//       profilePicture: ''
//     });
//   };

//   const searchUserByEmail = async () => {
//     try {
//       const response = await axios.get(`https://localhost:7062/api/Users/email/${searchEmail}`);
//       setUsers([response.data]);
//     } catch (error) {
//       console.error('Error searching user:', error);
//     }
//   };

//   // Dashboard Stats
//   const stats = [
//     { 
//       title: "Tổng người dùng", 
//       value: users.length, 
//       icon: "👥",
//       color: "bg-blue-50 text-blue-600" 
//     },
//     { 
//       title: "Tổng thợ", 
//       value: workers.length, 
//       icon: "👷",
//       color: "bg-purple-50 text-purple-600"
//     },
//     { 
//       title: "Loại công việc", 
//       value: jobTypes.length, 
//       icon: "🛠️",
//       color: "bg-yellow-50 text-yellow-600"
//     },
//     { 
//       title: "Đánh giá", 
//       value: reviews.length, 
//       icon: "⭐",
//       color: "bg-red-50 text-red-600"
//     }
//   ];

//   const userTypeData = [
//     { name: "Admin", value: users.filter(u => u.userType === 0).length },
//     { name: "Khách hàng", value: users.filter(u => u.userType === 1).length },
//     { name: "Thợ", value: users.filter(u => u.userType === 2).length }
//   ];

//   const jobTypeStats = jobTypes.map(jobType => ({
//     name: jobType.jobTypeName,
//     value: workerJobTypes.filter(wjt => wjt.jobTypeId === jobType.jobTypeId).length
//   }));

//   const COLORS = ['#4285F4', '#FFA726', '#2CC7C1', '#FF6B6B'];

//   const getUserType = (type) => {
//     switch (type) {
//       case 0: return 'Admin';
//       case 1: return 'Customer';
//       case 2: return 'Worker';
//       default: return 'Unknown';
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <div className="fixed left-0 top-0 h-full w-64 bg-white p-4 border-r">
//         <div className="flex items-center space-x-3 mb-8">
//           <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
//           <span className="font-medium">Admin Dashboard</span>
//         </div>
        
//         <nav>
//   <ul className="space-y-2">
//     <li 
//       className={`p-2 rounded-lg cursor-pointer ${activeView === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
//       onClick={() => setActiveView('dashboard')}
//     >
//       Dashboard
//     </li>
//     <li 
//       className={`p-2 rounded-lg cursor-pointer ${activeView === 'users' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
//       onClick={() => setActiveView('users')}
//     >
//       Users
//     </li>
//     <li className="p-2 hover:bg-gray-50 cursor-pointer">Workers</li>
//     <li className="p-2 hover:bg-gray-50 cursor-pointer">Job Types</li>
//     <li className="p-2 hover:bg-gray-50 cursor-pointer">Reviews</li>
//   </ul>
// </nav>
//       </div>

//       {/* Main content */}
//       <div className="ml-64 p-8">
//         <h1 className="text-xl font-medium mb-8">Hi, Welcome back 👋</h1>

//         {activeView === 'dashboard' ? (
//           <>
//             {/* Stats grid */}
//             <div className="grid grid-cols-4 gap-6 mb-8">
//               {stats.map((stat, index) => (
//                 <div key={index} className={`${stat.color} p-6 rounded-xl shadow-sm`}>
//                   <div className="flex items-center justify-between mb-2">
//                     <div className="text-gray-600">{stat.title}</div>
//                     <div className="text-2xl">{stat.icon}</div>
//                   </div>
//                   <div className="text-2xl font-semibold">{stat.value}</div>
//                 </div>
//               ))}
//             </div>

//             {/* Charts section */}
//             <div className="grid grid-cols-2 gap-6">
//               <div className="bg-white p-6 rounded-xl shadow-sm">
//                 <h3 className="text-lg font-medium mb-4">Phân bố người dùng</h3>
//                 <PieChart width={400} height={300}>
//                   <Pie
//                     data={userTypeData}
//                     cx={200}
//                     cy={150}
//                     innerRadius={60}
//                     outerRadius={100}
//                     paddingAngle={5}
//                     dataKey="value"
//                   >
//                     {userTypeData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </div>

//               <div className="bg-white p-6 rounded-xl shadow-sm">
//                 <h3 className="text-lg font-medium mb-4">Thống kê loại công việc</h3>
//                 <BarChart width={400} height={300} data={jobTypeStats}>
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Bar dataKey="value" fill="#4285F4" />
//                 </BarChart>
//               </div>
//             </div>
//           </>
//         ) : (
//           <>
//             {/* User Management Section */}
//             <div className="bg-white rounded-lg shadow-sm p-6">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-xl font-semibold">User Management</h2>
//                 <button
//                   onClick={() => {
//                     setSelectedUser(null);
//                     resetForm();
//                     setIsModalOpen(true);
//                   }}
//                   className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
//                 >
//                   Add New User
//                 </button>
//               </div>

//               {/* Search Bar */}
//               <div className="mb-6 flex gap-4">
//                 <input
//                   type="email"
//                   placeholder="Search by email..."
//                   value={searchEmail}
//                   onChange={(e) => setSearchEmail(e.target.value)}
//                   className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                 />
//                 <button
//                   onClick={searchUserByEmail}
//                   className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
//                 >
//                   Search
//                 </button>
//                 <button
//                   onClick={fetchDashboardData}
//                   className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
//                 >
//                   Reset
//                 </button>
//               </div>

//               {/* Users Table */}
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {users.map((user) => (
//                       <tr key={user.userId} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap">{user.fullName}</td>
//                         <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
//                         <td className="px-6 py-4 whitespace-nowrap">{user.phoneNumber}</td>
//                         <td className="px-6 py-4 whitespace-nowrap">{user.address}</td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`px-2 py-1 rounded-full text-xs ${
//                             user.userType === 0 ? 'bg-purple-100 text-purple-800' :
//                             user.userType === 1 ? 'bg-green-100 text-green-800' :
//                             'bg-blue-100 text-blue-800'
//                           }`}>
//                             {getUserType(user.userType)}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <button
//                             onClick={() => {
//                               setSelectedUser(user);
//                               setFormData({
//                                 fullName: user.fullName,
//                                 email: user.email,
//                                 phoneNumber: user.phoneNumber,
//                                 address: user.address,
//                                 userType: user.userType,
//                                 profilePicture: user.profilePicture || ''
//                               });
//                               setIsModalOpen(true);
//                             }}
//                             className="text-blue-600 hover:text-blue-900 mr-4"
//                           >
//                             Edit
//                           </button>
//                           <button
//                             onClick={() => handleDelete(user.userId)}
//                             className="text-red-600 hover:text-red-900"
//                           >
//                             Delete
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </>
//         )}

//         {/* Modal */}
//         {isModalOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white p-8 rounded-lg w-full max-w-md">
//               <h2 className="text-xl font-semibold mb-4">
//                 {selectedUser ? 'Edit User' : 'Add New User'}
//               </h2>
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Full Name</label>
//                   <input
//                     type="text"
//                     value={formData.fullName}
//                     onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Email</label>
//                   <input
//                     type="email"
//                     value={formData.email}
//                     onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Phone Number</label>
//                   <input
//                     type="tel"
//                     value={formData.phoneNumber}
//                     onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Address</label>
//                   <input
//                     type="text"
//                     value={formData.address}
//                     onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">User Type</label>
//                   <select
//                     value={formData.userType}
//                     onChange={(e) => setFormData({ ...formData, userType: parseInt(e.target.value) })}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   >
//                     <option value={0}>Admin</option>
//                     <option value={1}>Customer</option>
//                     <option value={2}>Worker</option>
//                   </select>
//                 </div>
//                 <div className="flex justify-end space-x-4 mt-6">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setIsModalOpen(false);
//                       setSelectedUser(null);
//                       resetForm();
//                     }}
//                     className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
//                   >
//                     {selectedUser ? 'Update' : 'Create'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

// //vô dụng 