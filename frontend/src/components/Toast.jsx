import React, { useEffect, useState } from 'react';

export default function Toast() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const showToast = (event) => {
      const detail = event.detail || {};
      setToast({
        message: detail.message || 'Success',
        type: detail.type || 'success'
      });

      setTimeout(() => {
        setToast(null);
      }, 2600);
    };

    window.addEventListener('show-toast', showToast);
    return () => window.removeEventListener('show-toast', showToast);
  }, []);

  if (!toast) return null;

  return (
    <div className={`toast toast-${toast.type}`}>
      <span>{toast.type === 'error' ? '⚠' : '✓'}</span>
      <p>{toast.message}</p>
    </div>
  );
}
