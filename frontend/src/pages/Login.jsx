import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/login`, formData);
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Invalid Credentials');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 text-start">
                    <div className="card shadow">
                        <div className="card-body">
                            <h2 className="text-center mb-4">Student Login</h2>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={onSubmit}>
                                <div className="mb-3">
                                    <label>Email</label>
                                    <input type="email" name="email" value={email} onChange={onChange} className="form-control" required />
                                </div>
                                <div className="mb-3">
                                    <label>Password</label>
                                    <input type="password" name="password" value={password} onChange={onChange} className="form-control" required />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Login</button>
                            </form>
                            <p className="mt-3 text-center">
                                Don't have an account? <Link to="/register">Register</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
