// src/pages/admin/ManageUsers.js
import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

/**
 * MANAGE USERS PAGE - Admin can view and manage all registered users.
 */
const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await adminAPI.getAllUsers();
        setUsers(response.data);
      } catch (err) {
        alert('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id, username) => {
    if (!window.confirm(`Delete user "${username}"? This cannot be undone.`)) return;
    try {
      await adminAPI.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const handleMakeAdmin = async (id, username) => {
    if (!window.confirm(`Make "${username}" an admin?`)) return;
    try {
      await adminAPI.makeAdmin(id);
      setUsers(users.map(u => u.id === id ? { ...u, role: 'ROLE_ADMIN' } : u));
    } catch (err) {
      alert('Failed to update role');
    }
  };

  if (loading) return <div style={styles.center}>Loading users...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Manage Users</h1>
      <p style={styles.subtitle}>{users.length} registered users</p>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Full Name</th>
              <th style={styles.th}>Username</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Joined</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={styles.tableRow}>
                <td style={styles.td}>#{user.id}</td>
                <td style={styles.td}>{user.fullName}</td>
                <td style={styles.td}>@{user.username}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.roleBadge,
                    backgroundColor: user.role === 'ROLE_ADMIN' ? '#f3e5f5' : '#e3f2fd',
                    color: user.role === 'ROLE_ADMIN' ? '#6a1b9a' : '#1565c0',
                  }}>
                    {user.role === 'ROLE_ADMIN' ? '⚡ Admin' : '👤 User'}
                  </span>
                </td>
                <td style={styles.td}>
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </td>
                <td style={styles.td}>
                  <div style={styles.actions}>
                    {user.role !== 'ROLE_ADMIN' && (
                      <button
                        onClick={() => handleMakeAdmin(user.id, user.username)}
                        style={styles.adminBtn}
                      >
                        Make Admin
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(user.id, user.username)}
                      style={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1100px', margin: '0 auto', padding: '32px 20px' },
  title: { fontSize: '28px', color: '#1a1a2e', margin: '0 0 8px' },
  subtitle: { color: '#666', marginBottom: '24px' },
  tableWrapper: { overflowX: 'auto', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' },
  tableHeader: { backgroundColor: '#f8f9fa' },
  th: { padding: '14px 16px', textAlign: 'left', fontSize: '13px', color: '#666', fontWeight: '600', borderBottom: '1px solid #eee' },
  tableRow: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '14px 16px', fontSize: '14px', color: '#333' },
  roleBadge: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' },
  actions: { display: 'flex', gap: '8px' },
  adminBtn: { padding: '6px 12px', backgroundColor: '#e3f2fd', color: '#1565c0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
  deleteBtn: { padding: '6px 12px', backgroundColor: '#fde8e8', color: '#c0392b', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
  center: { textAlign: 'center', padding: '60px', color: '#666' },
};

export default ManageUsers;
