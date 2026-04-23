import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const GrievanceForm = ({ fetchGrievances, editingId, setEditingId, token }) => {
  const [formData, setFormData] = useState({ title: '', description: '', category: 'Academic', status: 'Pending' });

  useEffect(() => {
    if (editingId) {
      // Fetch details of editing item
      const fetchGrievance = async () => {
        try {
          const res = await axios.get(`${API_URL}/grievances/${editingId}`, {
            headers: { 'x-auth-token': token }
          });
          setFormData({
            title: res.data.title,
            description: res.data.description,
            category: res.data.category,
            status: res.data.status
          });
        } catch (err) {
          console.error(err);
        }
      };
      fetchGrievance();
    } else {
      setFormData({ title: '', description: '', category: 'Academic', status: 'Pending' });
    }
  }, [editingId, token]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/grievances/${editingId}`, formData, {
          headers: { 'x-auth-token': token }
        });
        setEditingId(null);
      } else {
        await axios.post(`${API_URL}/grievances`, formData, {
          headers: { 'x-auth-token': token }
        });
      }
      setFormData({ title: '', description: '', category: 'Academic', status: 'Pending' });
      fetchGrievances();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="form-card side-form">
      <h3>{editingId ? 'Edit Grievance' : 'Submit New Grievance'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="Academic">Academic</option>
            <option value="Hostel">Hostel</option>
            <option value="Transport">Transport</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea rows="4" name="description" value={formData.description} onChange={handleChange} required></textarea>
        </div>
        
        {editingId && (
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn primary-btn">{editingId ? 'Update' : 'Submit'}</button>
          {editingId && (
            <button type="button" className="btn default-btn" onClick={() => setEditingId(null)}>Cancel</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default GrievanceForm;
