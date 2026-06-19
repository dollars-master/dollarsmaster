import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';

function Navbar() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  return (
    <nav className="bg-gray-900 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <h1 className="text-2xl font-bold text-blue-500">DollarsMaster</h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-gray-300">{user?.firstName} {user?.lastName}</span>
        <button
          onClick={() => dispatch(logout())}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;