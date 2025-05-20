import { useEffect, useState } from 'react';
import { Download, PlusCircle, Edit, Trash2, LogIn, ShieldCheck } from 'lucide-react';
import SideBar from './SideBar';

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(5);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/admin-logs`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => setLogs(data))
      .catch(err => console.error('Erreur chargement logs:', err));
  }, []);

  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentLogs = logs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(logs.length / perPage);

  const exportCSV = () => {
    window.open('http://127.0.0.1:8000/api/admin-logs/export-csv', '_blank');
  };

  const getActionStyle = (action) => {
    switch (action) {
      case 'create':
        return { color: 'text-green-700', bg: 'bg-green-100', icon: <PlusCircle className="w-4 h-4 mr-1" /> };
      case 'update':
        return { color: 'text-yellow-800', bg: 'bg-yellow-100', icon: <Edit className="w-4 h-4 mr-1" /> };
      case 'delete':
        return { color: 'text-red-700', bg: 'bg-red-100', icon: <Trash2 className="w-4 h-4 mr-1" /> };
      case 'login':
        return { color: 'text-blue-700', bg: 'bg-blue-100', icon: <LogIn className="w-4 h-4 mr-1" /> };
      default:
        return { color: 'text-gray-700', bg: 'bg-gray-200', icon: <ShieldCheck className="w-4 h-4 mr-1" /> };
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar />
      <div className="flex-1 ml-64 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Historique des actions admin</h2>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
          >
            <Download className="w-4 h-4" /> Exporter CSV
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentLogs.map(log => {
                  const { bg, color, icon } = getActionStyle(log.action);
                  return (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{new Date(log.created_at).toLocaleString()}</td>
                      <td className="px-6 py-4">{log.admin?.nom || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${bg} ${color}`}>
                          {icon}
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4">{log.description}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-green-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
