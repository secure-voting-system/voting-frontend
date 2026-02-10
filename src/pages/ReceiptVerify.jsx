import React, { useState } from 'react';
import { useData } from '../context/DataContext';

const ReceiptVerify = () => {
  const { verifyReceipt } = useData();
  const [receiptId, setReceiptId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await verifyReceipt(receiptId.trim());
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Receipt not found.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stack">
      <div className="card stack">
        <h3>Verify vote receipt</h3>
        <p className="helper">Enter a receipt ID to confirm the vote exists on-chain.</p>
        <form className="stack" onSubmit={handleVerify}>
          <div className="field">
            <label>Receipt ID</label>
            <input value={receiptId} onChange={(event) => setReceiptId(event.target.value)} required />
          </div>
          {error && <div className="badge danger">{error}</div>}
          {result && (
            <div className="badge success">
              Verified {result.receiptId || receiptId}
            </div>
          )}
          <button className="button" type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify receipt'}
          </button>
        </form>
      </div>
      {result && (
        <div className="card stack">
          <h3>Receipt details</h3>
          <div className="helper">Receipt ID</div>
          <strong>{result.receiptId || receiptId}</strong>
          {result.timestamp && (
            <div className="helper">{new Date(result.timestamp * 1000).toLocaleString()}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReceiptVerify;
