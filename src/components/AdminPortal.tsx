import React from 'react';
import { AdminDashboard } from './admin/AdminDashboard';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return <AdminDashboard onClose={onClose} />;
};
