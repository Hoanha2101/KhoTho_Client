// /Components/pages/Dashboard/Dashboard.jsx
import Sidebar from './Sidebar';
import DashboardContent from './DashboardContent';

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-[260px]"> {/* Điều chỉnh ml-[260px] để phù hợp với width của Sidebar */}
        <DashboardContent />
      </div>
      
    </div>
  );
};

export default Dashboard;