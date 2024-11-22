// /Components/pages/Dashboard/Dashboard.jsx
import Sidebar from './Sidebar';
import DashboardContent from './DashboardContent';
import NavBar from '../../NavBarLogin/NavBar';
import Footer from '../../FooterDiv/Footer';
import { API_ENDPOINT } from "../../../services/config";

const Dashboard = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* NavBar */}
      <header>
        <NavBar />
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 ml-[260px]"> {/* Điều chỉnh ml-[260px] để phù hợp với width của Sidebar */}
          <DashboardContent />
        </main>
      </div>

      {/* Footer */}
      {/* <footer>
        <Footer />
      </footer> */}
    </div>
  );
};

export default Dashboard;
