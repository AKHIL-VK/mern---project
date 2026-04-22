import { useState, useEffect } from 'react';
import axios from 'axios';
import { fetchProducts } from '../api';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

const Dashboard = () => {
    const [student, setStudent] = useState(null);
    const [pwdData, setPwdData] = useState({ oldPassword: '', newPassword: '' });
    const [courseData, setCourseData] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchStudentData = async () => {
            try {
                const res = await axios.get(`${API_URL}/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStudent(res.data);
                setCourseData(res.data.course);
            } catch (err) {
                console.error(err);
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }
        };

        fetchStudentData();
    }, [token, navigate]);

    useEffect(() => {
        // Call the backend API for products when the component mounts
        const getProducts = async () => {
            try {
                const response = await fetchProducts();
                setProducts(response.data);
            } catch (err) {
                console.error("Error connecting to backend products API:", err);
            }
        };

        getProducts();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handlePasswordUpdate = async e => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const res = await axios.put(`${API_URL}/update-password`, pwdData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(res.data.msg);
            setPwdData({ oldPassword: '', newPassword: '' });
        } catch (err) {
            setError(err.response?.data?.msg || 'Error updating password');
        }
    };

    const handleCourseUpdate = async e => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const res = await axios.put(`${API_URL}/update-course`, { course: courseData }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(res.data.msg);
            setStudent({ ...student, course: courseData });
        } catch (err) {
            setError(err.response?.data?.msg || 'Error updating course');
        }
    };

    if (!student) return <div className="text-center mt-5">Loading...</div>;

    return (
        <div className="container mt-5 text-start">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Student Dashboard</h2>
                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </div>

            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="card shadow mb-4">
                <div className="card-body">
                    <h4>Student Details</h4>
                    <p><strong>Name:</strong> {student.name}</p>
                    <p><strong>Email:</strong> {student.email}</p>
                    <p><strong>Enrolled Course:</strong> {student.course}</p>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6 mb-4">
                    <div className="card shadow h-100">
                        <div className="card-body">
                            <h4>Update Password</h4>
                            <form onSubmit={handlePasswordUpdate}>
                                <div className="mb-3">
                                    <label>Old Password</label>
                                    <input type="password" value={pwdData.oldPassword} onChange={e => setPwdData({ ...pwdData, oldPassword: e.target.value })} className="form-control" required />
                                </div>
                                <div className="mb-3">
                                    <label>New Password</label>
                                    <input type="password" value={pwdData.newPassword} onChange={e => setPwdData({ ...pwdData, newPassword: e.target.value })} className="form-control" required />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Update Password</button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 mb-4">
                    <div className="card shadow h-100">
                        <div className="card-body">
                            <h4>Change Course</h4>
                            <form onSubmit={handleCourseUpdate}>
                                <div className="mb-3">
                                    <label>New Course</label>
                                    <input type="text" value={courseData} onChange={e => setCourseData(e.target.value)} className="form-control" required />
                                </div>
                                <button type="submit" className="btn btn-warning w-100">Update Course</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Injected Product List from your Backend */}
            <div className="card shadow mb-4">
                 <div className="card-body">
                     <h4>My Products Directory (From Backend Integration)</h4>
                     {products.length === 0 ? (
                         <p className="text-muted">No products found or still loading...</p>
                     ) : (
                         <div className="list-group list-group-flush">
                             {products.map((item) => (
                                 <div className="list-group-item d-flex justify-content-between align-items-center" key={item._id}>
                                     <div>
                                         <h6 className="mb-0">{item.name}</h6>
                                     </div>
                                     <span className="badge bg-primary rounded-pill">${item.price}</span>
                                 </div>
                             ))}
                         </div>
                     )}
                 </div>
            </div>
        </div>
    );
};

export default Dashboard;
