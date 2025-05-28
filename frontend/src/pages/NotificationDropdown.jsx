import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Bell, Info } from "lucide-react";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/notifications", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });
      setNotifications(res.data);
    } catch (err) {
      console.error("Erreur chargement notifications :", err);
    }
  };

  useEffect(() => {
    if (isOpen) fetchNotifications();
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 relative hover:text-gray-800 focus:outline-none"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg z-50">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="text-gray-800 font-semibold">Notifications</h3>
            <Link to="/notifications" className="text-sm text-green-600 hover:underline">
              Voir tout
            </Link>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div key={notif.id} className="flex items-start gap-3 p-4 border-b last:border-none hover:bg-gray-50">
                  <div className="mt-1 bg-green-100 p-2 rounded-full">
                    <Info className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-800">{notif.data.message}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(notif.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-4 text-gray-500">Aucune notification</div>
            )}
          </div>

          <div className="text-center p-2 border-t">
            <Link to="/notifications" className="text-sm text-green-600 hover:underline">
              &uarr; Voir plus
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
