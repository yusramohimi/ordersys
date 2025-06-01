import React, { useEffect, useState } from "react";
import { Info } from "lucide-react";
import axios from "axios";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/notifications", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
        withCredentials: true,
      });

      const data = res.data.notifications ?? res.data ?? [];
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur chargement notifications :", err);
      setNotifications([]);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-5 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Notifications récentes</h2>
      </div>

      <SimpleBar style={{ maxHeight: "420px" }}>
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className="flex items-start gap-3 px-5 py-4 border-b last:border-none hover:bg-gray-50"
            >
              <div className="mt-1 bg-green-100 p-2 rounded-full shrink-0">
                <Info className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-grow text-sm">
                <p className="font-medium text-gray-800">Notification</p>
                <p className="text-gray-600">{notif.data?.message || "Notification reçue"}</p>
                <p className="text-gray-400 text-xs mt-1">
                  {new Date(notif.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 p-6">Aucune notification</div>
        )}
      </SimpleBar>
    </div>
  );
};

export default Notifications;
