import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaEnvelope, FaEnvelopeOpen, FaStar, FaRegStar, FaTrash,
  FaSearch, FaSync, FaDownload, FaSignOutAlt, FaShieldAlt,
  FaCalendarAlt, FaPhone, FaUser, FaTimes, FaReply, FaCheckDouble
} from 'react-icons/fa';
import './Admin.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalMessages: 0, unreadMessages: 0, starredMessages: 0, recent24h: 0 });
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'starred' | 'read'
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  
  const navigate = useNavigate();
  const adminUser = localStorage.getItem('adminUser') || 'Admin';
  const token = localStorage.getItem('adminToken');

  const getAuthHeaders = useCallback(() => {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }, [token]);

  // Fetch Dashboard Stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/stats`, { headers: getAuthHeaders() });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, [getAuthHeaders]);

  // Fetch Messages with search & filter
  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const queryParams = new URLSearchParams();
      if (filter !== 'all') queryParams.append('filter', filter);
      if (search.trim()) queryParams.append('search', search.trim());

      const res = await fetch(`${API_URL}/api/admin/messages?${queryParams.toString()}`, {
        headers: getAuthHeaders()
      });

      if (res.status === 401) {
        handleLogout();
        return;
      }

      const data = await res.json();
      if (data.success) {
        setMessages(data.data);
      } else {
        setErrorMsg(data.error || 'Failed to fetch messages');
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setErrorMsg('Could not connect to server.');
    } finally {
      setLoading(false);
    }
  }, [filter, search, getAuthHeaders]);

  useEffect(() => {
    fetchStats();
    fetchMessages();
  }, [fetchStats, fetchMessages]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  // Toggle Message Star status
  const handleToggleStar = async (id, currentStarred, e) => {
    if (e) e.stopPropagation();
    try {
      const res = await fetch(`${API_URL}/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isStarred: !currentStarred })
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => prev.map(m => m._id === id ? { ...m, isStarred: !currentStarred } : m));
        if (selectedMessage && selectedMessage._id === id) {
          setSelectedMessage(prev => ({ ...prev, isStarred: !currentStarred }));
        }
        fetchStats();
      }
    } catch (err) {
      console.error('Error toggling star:', err);
    }
  };

  // Toggle Message Read status
  const handleToggleRead = async (id, currentRead, e) => {
    if (e) e.stopPropagation();
    try {
      const res = await fetch(`${API_URL}/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isRead: !currentRead })
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: !currentRead } : m));
        if (selectedMessage && selectedMessage._id === id) {
          setSelectedMessage(prev => ({ ...prev, isRead: !currentRead }));
        }
        fetchStats();
      }
    } catch (err) {
      console.error('Error toggling read status:', err);
    }
  };

  // Delete Single Message
  const handleDeleteMessage = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/messages/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => prev.filter(m => m._id !== id));
        if (selectedMessage && selectedMessage._id === id) {
          setSelectedMessage(null);
        }
        setSelectedIds(prev => prev.filter(item => item !== id));
        fetchStats();
      }
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  // Open Message Detail (auto-mark read)
  const handleOpenDetail = async (message) => {
    setSelectedMessage(message);
    if (!message.isRead) {
      handleToggleRead(message._id, false);
    }
  };

  // Checkbox Selection
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(messages.map(m => m._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id, e) => {
    e.stopPropagation();
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Bulk Actions
  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;
    if (!window.confirm(`Delete ${selectedIds.length} selected messages?`)) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/messages/bulk-delete`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ ids: selectedIds })
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => prev.filter(m => !selectedIds.includes(m._id)));
        setSelectedIds([]);
        fetchStats();
      }
    } catch (err) {
      console.error('Error in bulk delete:', err);
    }
  };

  const handleBulkMarkRead = async (isRead) => {
    if (!selectedIds.length) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/messages/bulk-mark`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ ids: selectedIds, isRead })
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => prev.map(m => selectedIds.includes(m._id) ? { ...m, isRead } : m));
        setSelectedIds([]);
        fetchStats();
      }
    } catch (err) {
      console.error('Error in bulk mark:', err);
    }
  };

  // Export Messages to CSV
  const handleExportCSV = () => {
    if (!messages.length) return;
    const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Subject', 'Message', 'Date', 'Read', 'Starred'];
    const csvRows = [headers.join(',')];

    messages.forEach(m => {
      const row = [
        `"${m._id}"`,
        `"${(m.fullName || '').replace(/"/g, '""')}"`,
        `"${(m.email || '').replace(/"/g, '""')}"`,
        `"${(m.phone || '').replace(/"/g, '""')}"`,
        `"${(m.subject || '').replace(/"/g, '""')}"`,
        `"${(m.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
        `"${new Date(m.createdAt).toLocaleString()}"`,
        m.isRead ? 'Yes' : 'No',
        m.isStarred ? 'Yes' : 'No'
      ];
      csvRows.push(row.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `messages_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="admin-page-container">
      {/* Header Bar */}
      <header className="admin-dash-header">
        <div className="admin-dash-title">
          <FaShieldAlt style={{ color: 'var(--admin-accent-blue)' }} />
          <span>Admin Portal</span>
          <span className="admin-dash-badge">Live System</span>
        </div>

        <div className="admin-dash-user-bar">
          <div className="admin-user-tag">
            <div className="admin-user-avatar">{adminUser.charAt(0).toUpperCase()}</div>
            <span>{adminUser}</span>
          </div>

          <button onClick={handleLogout} className="admin-secondary-btn admin-logout-btn" title="Log Out">
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Metrics Cards Grid */}
      <section className="admin-stats-grid">
        <div className="admin-glass-card admin-stat-card">
          <div className="admin-stat-info">
            <p>Total Messages</p>
            <h3>{stats.totalMessages}</h3>
          </div>
          <div className="admin-stat-icon admin-icon-total">
            <FaEnvelope />
          </div>
        </div>

        <div className="admin-glass-card admin-stat-card">
          <div className="admin-stat-info">
            <p>Unread Messages</p>
            <h3>{stats.unreadMessages}</h3>
          </div>
          <div className="admin-stat-icon admin-icon-unread">
            <FaEnvelopeOpen />
          </div>
        </div>

        <div className="admin-glass-card admin-stat-card">
          <div className="admin-stat-info">
            <p>Starred Entries</p>
            <h3>{stats.starredMessages}</h3>
          </div>
          <div className="admin-stat-icon admin-icon-starred">
            <FaStar />
          </div>
        </div>

        <div className="admin-glass-card admin-stat-card">
          <div className="admin-stat-info">
            <p>Last 24 Hours</p>
            <h3>{stats.recent24h}</h3>
          </div>
          <div className="admin-stat-icon admin-icon-recent">
            <FaCalendarAlt />
          </div>
        </div>
      </section>

      {/* Controls Toolbar */}
      <section className="admin-glass-card admin-toolbar">
        <div className="admin-search-box">
          <FaSearch className="admin-search-icon" />
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search by sender, email, subject, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-filter-tabs">
          {[
            { id: 'all', label: 'All' },
            { id: 'unread', label: `Unread (${stats.unreadMessages})` },
            { id: 'starred', label: `Starred (${stats.starredMessages})` },
            { id: 'read', label: 'Read' }
          ].map(t => (
            <button
              key={t.id}
              className={`admin-filter-btn ${filter === t.id ? 'active' : ''}`}
              onClick={() => setFilter(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="admin-action-group">
          <button onClick={() => { fetchStats(); fetchMessages(); }} className="admin-secondary-btn" title="Refresh">
            <FaSync className={loading ? 'fa-spin' : ''} />
            <span>Refresh</span>
          </button>

          <button onClick={handleExportCSV} className="admin-secondary-btn" disabled={!messages.length} title="Export CSV">
            <FaDownload />
            <span>Export CSV</span>
          </button>
        </div>
      </section>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="admin-bulk-bar">
          <span>{selectedIds.length} message(s) selected</span>
          <div className="admin-bulk-actions">
            <button onClick={() => handleBulkMarkRead(true)} className="admin-secondary-btn">
              <FaCheckDouble /> Mark as Read
            </button>
            <button onClick={() => handleBulkMarkRead(false)} className="admin-secondary-btn">
              <FaEnvelope /> Mark as Unread
            </button>
            <button onClick={handleBulkDelete} className="admin-secondary-btn admin-logout-btn">
              <FaTrash /> Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Messages Table Container */}
      <section className="admin-glass-card admin-table-container">
        {loading ? (
          <div className="admin-empty-state">
            <FaSync className="admin-empty-icon fa-spin" />
            <p>Loading messages...</p>
          </div>
        ) : errorMsg ? (
          <div className="admin-empty-state">
            <p style={{ color: '#fca5a5' }}>⚠️ {errorMsg}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="admin-empty-state">
            <FaEnvelopeOpen className="admin-empty-icon" />
            <h3>No messages found</h3>
            <p>There are no messages matching your search or filter parameters.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.length === messages.length && messages.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th style={{ width: '40px' }}>★</th>
                <th>Sender</th>
                <th>Subject</th>
                <th>Received</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <tr
                  key={m._id}
                  className={`admin-row ${!m.isRead ? 'unread-row' : ''}`}
                  onClick={() => handleOpenDetail(m)}
                >
                  <td onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(m._id)}
                      onChange={(e) => handleSelectOne(m._id, e)}
                    />
                  </td>
                  <td>
                    <button
                      className={`admin-star-btn ${m.isStarred ? 'starred' : ''}`}
                      onClick={(e) => handleToggleStar(m._id, m.isStarred, e)}
                      title={m.isStarred ? 'Unstar' : 'Star'}
                    >
                      {m.isStarred ? <FaStar /> : <FaRegStar />}
                    </button>
                  </td>
                  <td>
                    <div className="admin-sender-info">
                      <span className="admin-sender-name">
                        {!m.isRead && <span className="admin-unread-dot" />}
                        {m.fullName}
                      </span>
                      <span className="admin-sender-email">{m.email}</span>
                    </div>
                  </td>
                  <td>
                    <div className="admin-subject-snippet" title={m.subject}>
                      {m.subject}
                    </div>
                  </td>
                  <td>
                    <span className="admin-date-text">{formatDate(m.createdAt)}</span>
                  </td>
                  <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                    <button
                      className="admin-icon-btn"
                      onClick={(e) => handleDeleteMessage(m._id, e)}
                      title="Delete message"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="admin-modal-overlay" onClick={() => setSelectedMessage(null)}>
          <div className="admin-glass-card admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <h3 className="admin-modal-subject">{selectedMessage.subject}</h3>
                <span className="admin-modal-date">Received on {new Date(selectedMessage.createdAt).toLocaleString()}</span>
              </div>
              <button className="admin-modal-close-btn" onClick={() => setSelectedMessage(null)}>
                <FaTimes />
              </button>
            </div>

            <div className="admin-modal-meta">
              <div className="admin-meta-item">
                <label><FaUser /> Sender</label>
                <span>{selectedMessage.fullName}</span>
              </div>
              <div className="admin-meta-item">
                <label><FaEnvelope /> Email</label>
                <span>{selectedMessage.email}</span>
              </div>
              {selectedMessage.phone && (
                <div className="admin-meta-item">
                  <label><FaPhone /> Phone</label>
                  <span>{selectedMessage.phone}</span>
                </div>
              )}
            </div>

            <div className="admin-modal-body-content">
              {selectedMessage.message}
            </div>

            <div className="admin-modal-actions">
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                className="admin-primary-btn"
                style={{ width: 'auto', textDecoration: 'none', padding: '10px 20px' }}
              >
                <FaReply /> Reply via Email
              </a>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className="admin-secondary-btn"
                  onClick={() => handleToggleStar(selectedMessage._id, selectedMessage.isStarred)}
                >
                  {selectedMessage.isStarred ? <FaStar style={{ color: '#fbbf24' }} /> : <FaRegStar />}
                  <span>{selectedMessage.isStarred ? 'Starred' : 'Star'}</span>
                </button>

                <button
                  className="admin-secondary-btn"
                  onClick={() => handleToggleRead(selectedMessage._id, selectedMessage.isRead)}
                >
                  {selectedMessage.isRead ? <FaEnvelope /> : <FaEnvelopeOpen />}
                  <span>{selectedMessage.isRead ? 'Mark Unread' : 'Mark Read'}</span>
                </button>

                <button
                  className="admin-secondary-btn admin-logout-btn"
                  onClick={() => handleDeleteMessage(selectedMessage._id)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
