import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [workersByJobType, setWorkersByJobType] = useState({});
  const [workerJobTypes, setWorkerJobTypes] = useState([]);
  
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          usersRes,
          workersRes,
          jobTypesRes,
          reviewsRes,
          workerJobTypesRes,
        ] = await Promise.all([
          fetch("https://localhost:7062/api/Users"),
          fetch("https://localhost:7062/api/Workers"),
          fetch("https://localhost:7062/api/JobTypes"),
          fetch("https://localhost:7062/api/Reviews"),
          fetch("https://localhost:7062/api/WorkerJobTypes"),
        ]);

        const usersData = await usersRes.json();
        const workersData = await workersRes.json();
        const jobTypesData = await jobTypesRes.json();
        const reviewsData = await reviewsRes.json();
        const workerJobTypesData = await workerJobTypesRes.json();

        setUsers(usersData);
        setWorkers(workersData);
        setJobTypes(jobTypesData);
        setReviews(reviewsData);
        setWorkerJobTypes(workerJobTypesData);

        // Calculate workers per job type using WorkerJobTypes data
        const workerCounts = {};
        jobTypesData.forEach((jobType) => {
          const count = workerJobTypesData.filter(
            (wjt) => wjt.jobTypeId === jobType.jobTypeId
          ).length;
          workerCounts[jobType.jobTypeName] = count;
        });
        setWorkersByJobType(workerCounts);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const stats = {
    totalUsers: users.length,
    totalWorkers: workers.length,
    totalJobTypes: jobTypes.length,
    totalRatings: calculateAverageRating(),
  };

  // Calculate user distribution
const verifiedWorkerCount = workers.filter(worker => worker.verified).length;
const customerCount = users.filter(user => user.userType === 1).length;
const adminCount = users.filter(user => user.userType === 0).length;

const pieData = {
  labels: ["Khách hàng", "Thợ đã xác minh", "Admin"],
  datasets: [
    {
      data: [customerCount, verifiedWorkerCount, adminCount],
      backgroundColor: [
        "rgba(54, 162, 235, 0.8)",
        "rgba(153, 102, 255, 0.8)",
        "rgba(255, 99, 132, 0.8)",
      ],
      borderWidth: 1,
    },
  ],
};

  const barData = {
    labels: jobTypes.map((job) => job.jobTypeName),
    datasets: [
      {
        label: "Số lượng thợ",
        data: jobTypes.map((job) => workersByJobType[job.jobTypeName] || 0),
        backgroundColor: "rgba(54, 162, 235, 0.8)",
      },
    ],
  };

  const StatCard = ({ title, value, icon, bgColor, textColor }) => (
    <div
      className={`p-6 ${bgColor} rounded-lg shadow-sm hover:shadow-md transition-shadow`}
    >
      <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
      <div className="flex items-center justify-between">
        <span className={`text-3xl font-bold ${textColor}`}>{value}</span>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  );

  const lineData = {
    labels: Object.keys(workersByJobType),
    datasets: [
      {
        label: "Số lượng thợ",
        data: Object.values(workersByJobType),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
        pointBackgroundColor: "rgb(75, 192, 192)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* ... previous JSX remains the same until the charts section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Hello, welcome back 👋
        </h2>
        <p className="text-gray-600 mt-2">
          This is an overview of the KhoTho system
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Tổng người dùng"
          value={stats.totalUsers}
          icon="👥"
          bgColor="bg-blue-50"
          textColor="text-blue-600"
        />
        <StatCard
          title="Tổng thợ"
          value={stats.totalWorkers}
          icon="👷"
          bgColor="bg-purple-50"
          textColor="text-purple-600"
        />
        <StatCard
          title="Loại công việc"
          value={stats.totalJobTypes}
          icon="🔧"
          bgColor="bg-yellow-50"
          textColor="text-yellow-600"
        />
        <StatCard
          title="Đánh giá trung bình"
          value={stats.totalRatings}
          icon="⭐"
          bgColor="bg-red-50"
          textColor="text-red-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-6 text-gray-800">
            Phân bố người dùng
          </h3>
          <div className="h-[300px] flex items-center justify-center">
            <Pie
              data={pieData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-6 text-gray-800">
            Thống kê thợ cho mỗi công việc
          </h3>
          <div className="h-[300px]">
            <Line
              data={lineData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: "bottom",
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
