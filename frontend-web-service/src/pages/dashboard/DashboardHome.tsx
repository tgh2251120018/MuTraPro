import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import { FaChartPie, FaSpinner } from 'react-icons/fa6';
import CreateRequestModal from '../../components/modals/CreateRequestModal';
import { type RequestResponse } from '../../types/request';
import RequestCard from '../../components/RequestCard';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const DashboardHome: React.FC = () => {
    const { user } = useContext(UserContext);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State quản lý dữ liệu và loading
    const [requests, setRequests] = useState<RequestResponse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Hàm gọi API lấy danh sách Request
    const fetchRequests = async () => {
        setIsLoading(true);
        try {
            // Gọi GET /requests/
            const response = await axiosInstance.get<RequestResponse[]>(API_PATHS.REQUESTS.GET_ALL);

            // Sắp xếp: Mới nhất lên đầu (Dựa vào created_at)
            const sortedData = response.data.sort((a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );

            setRequests(sortedData);
        } catch (error) {
            console.error("Failed to fetch requests:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Gọi API khi component mount
    useEffect(() => {
        fetchRequests();
    }, []);

    return (
        <div>
            {/* --- HEADER --- */}
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-main)', margin: 0 }}>
                    Dashboard
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
                    Welcome back, {user?.fullName || 'User'}! Here's your overview.
                </p>
            </div>

            {/* --- ACTION BUTTON --- */}
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    + New Request
                </button>
            </div>

            {/* --- CONTENT AREA --- */}
            {isLoading ? (
                // 1. TRẠNG THÁI LOADING
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                    <FaSpinner className="animate-spin" size={30} color="var(--primary-color)" />
                </div>
            ) : requests.length === 0 ? (
                // 2. TRẠNG THÁI TRỐNG (NO DATA)
                <div className="card">
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
                        <div style={{
                            width: '60px', height: '60px', borderRadius: '50%',
                            backgroundColor: 'var(--bg-app)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', marginBottom: '16px'
                        }}>
                            <FaChartPie size={24} color="var(--primary-color)" />
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-main)', margin: '0 0 8px 0' }}>
                            No Data Yet
                        </h3>
                        <p style={{ fontSize: '14px', margin: 0 }}>
                            You haven't created any requests yet.
                        </p>
                    </div>
                </div>
            ) : (
                // 3. TRẠNG THÁI CÓ DỮ LIỆU (LIST)
                <div>
                    {requests.map((req) => (
                        <RequestCard key={req._id} request={req} />
                    ))}
                </div>
            )}

            {/* --- MODAL --- */}
            <CreateRequestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    // Khi tạo xong thành công, gọi lại API để làm mới danh sách
                    fetchRequests();
                }}
            />
        </div>
    );
};

export default DashboardHome;