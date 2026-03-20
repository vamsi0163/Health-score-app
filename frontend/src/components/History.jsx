import React, { useEffect, useState } from 'react';
import { fetchRecords, deleteRecord } from '../services/api';

const categoryColors = {
  Excellent: '#10b981', Good: '#3b82f6',
  'Needs Improvement': '#eab308', Poor: '#f97316', Critical: '#ef4444',
};

export default function History({ refreshTrigger }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchRecords();
      setRecords(data);
    } catch {
      setError('History unavailable (MongoDB not connected)');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [refreshTrigger]);

  const handleDelete = async (id) => {
    await deleteRecord(id);
    setRecords((r) => r.filter((x) => x._id !== id));
  };

  if (loading) return <p className="muted">Loading history…</p>;
  if (error)   return <p className="muted">{error}</p>;
  if (!records.length) return <p className="muted">No records yet. Submit some health data!</p>;

  return (
    <div className="history">
      <h2>Recent Records</h2>
      <div className="history-list">
        {records.map((r) => (
          <div key={r._id} className="history-item">
            <div className="history-score" style={{ color: categoryColors[r.result.category] }}>
              {r.result.health_score}
            </div>
            <div className="history-meta">
              <strong>{r.result.category}</strong>
              <span>{new Date(r.createdAt).toLocaleString()}</span>
            </div>
            <button className="btn-ghost" onClick={() => handleDelete(r._id)} title="Delete">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}
