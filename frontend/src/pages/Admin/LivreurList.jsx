import { useEffect, useState } from "react";
import axios from "axios";
import SideBar from "./Sidebar";

function LivreurList() {
  const [livreurs, setLivreurs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchLivreurs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/admin/livreurlist"
        );
        setLivreurs(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des livreurs :", error);
      }
    };

    fetchLivreurs();
  }, []);

  const filteredLivreurs = livreurs.filter((livreur) =>
    livreur.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredLivreurs.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedLivreurs = filteredLivreurs.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64">
        <SideBar />
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Delivery Men</h1>
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="w-full text-sm table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Region ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Region Name
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedLivreurs.length > 0 ? (
                paginatedLivreurs.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {user.id}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{user.nom}</td>
                    <td className="px-4 py-3 text-gray-500">{user.region_id}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {user.region?.nom || "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 py-3 text-center text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center px-4 py-4">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              page === 1
                ? "bg-gray-200 text-gray-500"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={page === totalPages}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              page === totalPages
                ? "bg-gray-200 text-gray-500"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default LivreurList;
