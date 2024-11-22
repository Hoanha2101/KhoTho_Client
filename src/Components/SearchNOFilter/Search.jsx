import React, { useEffect, useState } from "react";
import { AiOutlineCloseCircle, AiOutlineSearch } from "react-icons/ai";
import { CiLocationOn } from "react-icons/ci";
import { MdWorkOutline, MdVerified } from "react-icons/md";
import { BsBriefcase } from "react-icons/bs";
import { FaStar } from "react-icons/fa";
import { BiStar } from "react-icons/bi";
import { API_ENDPOINT } from "../../services/config";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Search = () => {
  
  const [jobTypes, setJobTypes] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [selectedJobType, setSelectedJobType] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [workerJobTypes, setWorkerJobTypes] = useState([]);
  const [selectedRating, setSelectedRating] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const workersPerPage = 8;

  const navigate = useNavigate();
  const handleViewProfile = (workerId) => {
    navigate(`/worker-profile/${workerId}`);
  };

  const ratingRanges = [
    { label: "1-2 sao", min: 1, max: 2 },
    { label: "2-3 sao", min: 2, max: 3 },
    { label: "3-4 sao", min: 3, max: 4 },
    { label: "4-5 sao", min: 4, max: 5 },
  ];

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [jobTypesResponse, workersResponse, workerJobTypesResponse] =
          await Promise.all([
            axios.get(`${API_ENDPOINT}/api/JobTypes`, {
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
              },
          }),
            axios.get(`${API_ENDPOINT}/api/Workers`, {
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
              },
          }),
            axios.get(`${API_ENDPOINT}/api/WorkerJobTypes`, {
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
              },
          }),
          ]);

        setJobTypes(jobTypesResponse.data);
        setWorkers(workersResponse.data);
        setWorkerJobTypes(workerJobTypesResponse.data);
        setFilteredWorkers(workersResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    let filtered = workers;

    if (selectedLocation) {
      filtered = filtered.filter((worker) =>
        worker.user.address
          .toLowerCase()
          .includes(selectedLocation.toLowerCase())
      );
    }

    if (selectedExperience) {
      const years = parseInt(selectedExperience);
      filtered = filtered.filter((worker) => worker.experienceYears === years);
    }

    if (selectedRating) {
      const [min, max] = selectedRating.split("-").map(Number);
      filtered = filtered.filter(
        (worker) => worker.rating >= min && worker.rating <= max
      );
    }

    if (selectedJobType) {
      filtered = filtered.filter((worker) => {
        // Tìm các worker job type của worker này
        const workerJobs = workerJobTypes.filter(
          (wjt) => wjt.workerId === worker.workerId
        );
        // Tìm job type tương ứng
        const jobType = jobTypes.find(
          (jt) =>
            workerJobs.some((wj) => wj.jobTypeId === jt.jobTypeId) &&
            jt.jobTypeName === selectedJobType
        );
        return jobType !== undefined;
      });
    }

    setFilteredWorkers(filtered);
    setCurrentPage(1);
  };

  const SearchBox = ({
    icon: Icon,
    label,
    value,
    onChange,
    options,
    type = "select",
    onClear,
  }) => (
    <div className="relative flex-1">
      <div className="relative bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md">
        <div className="flex items-center p-3 border border-gray-200 rounded-lg">
          <Icon className="text-gray-400 text-xl mr-2" />
          {type === "select" ? (
            <select
              className="w-full bg-transparent focus:outline-none text-gray-600"
              value={value}
              onChange={onChange}
            >
              <option value="">{label}</option>
              {options.map((option, index) => (
                <option
                  key={index}
                  value={
                    typeof option === "object"
                      ? option.jobTypeName || `${option.min}-${option.max}`
                      : option
                  }
                >
                  {typeof option === "object"
                    ? option.jobTypeName || option.label
                    : `${option} năm`}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              placeholder={label}
              className="w-full bg-transparent focus:outline-none text-gray-600"
              value={value}
              onChange={(e) => onChange(e.target.value)} // Thay đổi ở đây
            />
          )}
          {value && (
            <AiOutlineCloseCircle
              className="text-gray-400 text-xl cursor-pointer hover:text-gray-600 transition-colors"
              onClick={onClear}
            />
          )}
        </div>
      </div>
    </div>
  );

  const WorkerCard = ({ worker }) => {
    const { user, experienceYears, bio, rating, verified } = worker;

    return (
      <div className="bg-white rounded-xl p-6 transition-all duration-300 hover:shadow-xl">
        <div className="flex items-start gap-4">
          <img
            src="https://png.pngtree.com/png-vector/20240405/ourlarge/pngtree-car-mechanic-vector-icon-png-image_12264316.png"
            alt={`${user.fullName}'s profile`}
            className="w-20 h-20 rounded-xl object-cover"
          />
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800">
              {user.fullName}
            </h2>
            <div className="flex items-center gap-2 mt-1 text-gray-600">
              <CiLocationOn className="text-gray-400" />
              <span className="text-sm">
                {user.address || "Chưa cập nhật địa chỉ"}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <BsBriefcase className="text-blue-500" />
                <span className="text-sm text-gray-600">
                  {experienceYears} năm kinh nghiệm
                </span>
              </div>
              <div className="flex items-center gap-1">
                <BiStar className="text-yellow-400" />
                <span className="text-sm text-gray-600">
                  {rating}/5 đánh giá
                </span>
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
          <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          onClick={() => handleViewProfile(worker.workerId)}>
            Xem hồ sơ
          </button>
        </div>
      </div>
    );
  };

  const PaginationButton = ({ page, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 mx-1 rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-blue-600 text-white"
          : "bg-white text-gray-600 hover:bg-blue-50"
      }`}
    >
      {page}
    </button>
  );

  // Tính toán phân trang
  const indexOfLastWorker = currentPage * workersPerPage;
  const indexOfFirstWorker = indexOfLastWorker - workersPerPage;
  const currentWorkers = filteredWorkers.slice(
    indexOfFirstWorker,
    indexOfLastWorker
  );
  const totalPages = Math.ceil(filteredWorkers.length / workersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="">

      {/* Kết quả tìm kiếm */}
      <div className="mt-8">

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {currentWorkers.map((worker) => (
                <WorkerCard key={worker.workerId} worker={worker} />
              ))}
            </div>

            {filteredWorkers.length === 0 && (
              <div className="text-center text-gray-600 py-8">
                Không tìm thấy thợ phù hợp với tìm kiếm của bạn
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
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
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-white text-gray-600 hover:bg-blue-50 disabled:opacity-50"
                >
                  <IoIosArrowForward />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
