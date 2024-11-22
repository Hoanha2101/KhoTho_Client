import React, { useEffect, useState } from 'react';
import { BiTimeFive, BiStar } from 'react-icons/bi';
import { MdVerified, MdLocationOn } from 'react-icons/md';
import { BsBriefcase } from 'react-icons/bs';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { API_ENDPOINT } from "../../services/config";


const Jobs = () => {
  const [workers, setWorkers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const workersPerPage = 8;

  useEffect(() => {
    setLoading(true);
    // use API_ENDPOINT instead of hardcoding the URL
    fetch(`${API_ENDPOINT}/api/Workers`)
      .then(response => response.json())
      .then(data => {
        setWorkers(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching workers:', error);
        setLoading(false);
      });
  }, []);

  // Tính toán các worker cho trang hiện tại
  const indexOfLastWorker = currentPage * workersPerPage;
  const indexOfFirstWorker = indexOfLastWorker - workersPerPage;
  const currentWorkers = workers.slice(indexOfFirstWorker, indexOfLastWorker);
  const totalPages = Math.ceil(workers.length / workersPerPage);

  // Xử lý chuyển trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Component cho nút phân trang
  const PaginationButton = ({ page, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 mx-1 rounded-lg transition-all duration-200 ${
        isActive 
          ? 'bg-blue-600 text-white'
          : 'bg-white text-gray-600 hover:bg-blue-50'
      }`}
    >
      {page}
    </button>
  );

  const WorkerCard = ({ worker }) => {
    const { user, experienceYears, bio, rating, verified } = worker;
    
    return (
      <div className="bg-white rounded-xl p-6 transition-all duration-300 hover:shadow-xl">
        <div className="flex items-start gap-4">
          <img
            src="src\Assets\images\thodien.jpg"
            alt={`${user.fullName}'s profile`}
            className="w-20 h-20 rounded-xl object-cover"
          />
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800">{user.fullName}</h2>
            <div className="flex items-center gap-2 mt-1 text-gray-600">
              <MdLocationOn className="text-gray-400" />
              <span className="text-sm">{user.address || 'Chưa cập nhật địa chỉ'}</span>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <BsBriefcase className="text-blue-500" />
                <span className="text-sm text-gray-600">{experienceYears} năm kinh nghiệm</span>
              </div>
              <div className="flex items-center gap-1">
                <BiStar className="text-yellow-400" />
                <span className="text-sm text-gray-600">{rating}/5 đánh giá</span>
              </div>
              {verified && (
                <div className="flex items-center gap-1 text-green-500">
                  <MdVerified />
                  <span className="text-sm">Đã xác minh</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="mt-4 text-gray-600 text-sm line-clamp-2">{bio}</p>

        <div className="mt-4 flex gap-2">
          <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Liên hệ ngay
          </button>
          <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
            Xem hồ sơ
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Danh sách thợ ({workers.length})</h1>
        <p className="text-gray-600 mt-2">Tìm kiếm thợ phù hợp với nhu cầu của bạn</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {currentWorkers.map((worker) => (
          <WorkerCard key={worker.workerId} worker={worker} />
        ))}
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-white text-gray-600 hover:bg-blue-50 disabled:opacity-50"
          >
            <IoIosArrowBack />
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <PaginationButton
              key={index + 1}
              page={index + 1}
              isActive={currentPage === index + 1}
              onClick={() => paginate(index + 1)}
            />
          ))}

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-white text-gray-600 hover:bg-blue-50 disabled:opacity-50"
          >
            <IoIosArrowForward />
          </button>
        </div>
      )}
    </div>
  );
};

export default Jobs;