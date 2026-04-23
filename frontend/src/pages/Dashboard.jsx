import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdEdit, MdDelete, MdCheckCircle, MdPendingActions } from 'react-icons/md';
import GrievanceForm from '../components/GrievanceForm';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import './Dashboard.css';

const Dashboard = ({ setAuth }) => {
  const [grievances, setGrievances] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!token) {
      setAuth(false);
      navigate('/login');
    } else {
      fetchGrievances();
    }
  }, [token, navigate]);

  const fetchGrievances = async () => {
    try {
      const res = await axios.get(`${API_URL}/grievances`, {
        headers: { 'x-auth-token': token }
      });
      setGrievances(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`${API_URL}/grievances/search?title=${searchQuery}`, {
        headers: { 'x-auth-token': token }
      });
      setGrievances(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchGrievances();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this grievance?')) {
      try {
        await axios.delete(`${API_URL}/grievances/${id}`, {
          headers: { 'x-auth-token': token }
        });
        fetchGrievances();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth(false);
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <div className="header-brand">Student Portal</div>
        <div className="header-user">
          <span>Welcome, {user?.name}</span>
          <button className="btn secondary-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-sidebar">
          <GrievanceForm 
            fetchGrievances={fetchGrievances} 
            editingId={editingId} 
            setEditingId={setEditingId} 
            token={token} 
          />
        </div>

        <div className="dashboard-content">
          <div className="content-header">
            <h2>Your Grievances</h2>
            <form onSubmit={handleSearch} className="search-bar">
              <input 
                type="text" 
                placeholder="Search by title..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn primary-btn">Search</button>
              {searchQuery && <button type="button" className="btn default-btn" onClick={handleClearSearch}>Clear</button>}
            </form>
          </div>

          <div className="grievance-list">
             {grievances.length === 0 ? (
               <div className="no-data">No grievances found.</div>
             ) : (
               grievances.map(item => (
                 <div className="grievance-card" key={item._id}>
                   <div className="card-header">
                     <h3>{item.title}</h3>
                     <span className={`status-badge ${item.status.toLowerCase()}`}>
                       {item.status === 'Resolved' ? <MdCheckCircle /> : <MdPendingActions />}
                       {item.status}
                     </span>
                   </div>
                   <p className="description">{item.description}</p>
                   <div className="card-footer">
                     <span className="category-label">{item.category}</span>
                     <span className="date-label">{new Date(item.date).toLocaleDateString()}</span>
                     <div className="card-actions">
                       <button className="icon-btn edit-btn" onClick={() => setEditingId(item._id)}><MdEdit /> Edit</button>
                       <button className="icon-btn delete-btn" onClick={() => handleDelete(item._id)}><MdDelete /> Delete</button>
                     </div>
                   </div>
                 </div>
               ))
             )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
