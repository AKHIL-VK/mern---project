import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        course: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { name, email, password, course } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/register`, formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.msg || 'An error occurred during registration');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 text-start">
                    <div className="card shadow">
                        <div className="card-body">
                            <h2 className="text-center mb-4">Student Registration</h2>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={onSubmit}>
                                <div className="mb-3">
                                    <label>Name</label>
                                    <input type="text" name="name" value={name} onChange={onChange} className="form-control" required />
                                </div>
                                <div className="mb-3">
                                    <label>Email</label>
                                    <input type="email" name="email" value={email} onChange={onChange} className="form-control" required />
                                </div>
                                <div className="mb-3">
                                    <label>Password</label>
                                    <input type="password" name="password" value={password} onChange={onChange} className="form-control" required />
                                </div>
                                <div className="mb-3">
                                    <label>Course</label>
                                    <input type="text" name="course" value={course} onChange={onChange} className="form-control" required />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Register</button>
                            </form>
                            <p className="mt-3 text-center">
                                Already have an account? <Link to="/login">Login</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
