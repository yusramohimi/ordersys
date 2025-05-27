import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap";
import SimpleBar from "simplebar-react";
import axios from "axios";

const NotificationDropdown = () => {
  const [menu, setMenu] = useState(false);
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
    if (menu) fetchNotifications();
  }, [menu]);

  return (
    <Dropdown
      isOpen={menu}
      toggle={() => setMenu(!menu)}
      className="dropdown d-inline-block"
      tag="li"
    >
      <DropdownToggle
        className="btn header-item noti-icon"
        tag="button"
        id="page-header-notifications-dropdown"
      >
        <i className="ri-notification-3-line" />
        {notifications.length > 0 && <span className="noti-dot" />}
      </DropdownToggle>

      <DropdownMenu className="dropdown-menu-lg dropdown-menu-end p-0">
        <div className="p-3">
          <Row className="align-items-center">
            <Col>
              <h6 className="m-0">Notifications</h6>
            </Col>
            <div className="col-auto">
              <Link to="/notifications" className="small">
                Voir tout
              </Link>
            </div>
          </Row>
        </div>

        <SimpleBar style={{ height: "230px" }}>
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <Link
                to="#"
                key={notif.id}
                className="text-reset notification-item"
              >
                <div className="d-flex">
                  <div className="flex-shrink-0 me-3">
                    <div className="avatar-xs">
                      <span className="avatar-title bg-success rounded-circle font-size-16">
                        <i className="ri-information-line"></i>
                      </span>
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{notif.data.message}</h6>
                    <div className="font-size-12 text-muted">
                      <p className="mb-0">
                        <i className="mdi mdi-clock-outline"></i>{" "}
                        {new Date(notif.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center p-3 text-muted">
              Aucune notification
            </div>
          )}
        </SimpleBar>

        <div className="p-2 border-top d-grid">
          <Link className="btn btn-sm btn-link font-size-14 text-center" to="/notifications">
            <i className="mdi mdi-arrow-right-circle me-1"></i> Voir plus
          </Link>
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

export default NotificationDropdown;
