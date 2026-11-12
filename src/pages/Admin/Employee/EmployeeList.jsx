
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "./EmployeeList.css";
// import { updateEmployeeStatus } from "../../../services/authService";
// import SalaryModal from "../../../components/Admin/Salary/SalaryModal";
// const API_URL = import.meta.env.VITE_API_URL;


// function EmployeeList() {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedSalaryEmployeeId, setSelectedSalaryEmployeeId] =
//     useState(null);

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   const fetchEmployees = async () => {
//     try {
//       setLoading(true);

//       // const res = await axios.get(
//       //   "http://localhost:5000/api/users/employees",
//       //   {
//       //     headers: {
//       //       Authorization: `Bearer ${token}`,
//       //     },
//       //   }
//       // );

// const res = await axios.get(
//   `${API_URL}/users/employees`,
//   {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   }
// );

//       setEmployees(res.data.data || []);
//     } catch (error) {
//       console.log(error);
//       alert("Unable to fetch employees");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const changeStatus = async (id, status) => {
//     try {
//       await updateEmployeeStatus(id, status);
//       fetchEmployees();
//     } catch (error) {
//       console.log(error);
//       alert("Unable To Update Status");
//     }
//   };

//   return (
//     <div className="employee-list-page">

//       <h2>Employee List</h2>

//       <table className="employee-table">

//         <thead>
//           <tr>
//             <th>Employee ID</th>
//             <th>Employee Name</th>
//             <th>Email</th>
//             <th>Phone</th>
//             <th>Role</th>
//             <th>Department</th>
//             <th>Designation</th>
//             <th>Joining Date</th>
//             <th>System Access</th>
//             <th>Status</th>
//             <th>Action</th>
//           </tr>
//         </thead>

//         <tbody>

//           {loading ? (
//             <tr>
//               <td colSpan="11">Loading...</td>
//             </tr>
//           ) : employees.length === 0 ? (
//             <tr>
//               <td colSpan="11">No Employee Found</td>
//             </tr>
//           ) : (
//             employees.map((employee) => (
//               <tr key={employee._id}>

//                 {/* Employee ID */}
//                 <td>{employee.employeeId || "-"}</td>

//                 {/* Employee Name */}
//                 <td>
//                   {employee.firstName} {employee.lastName}
//                 </td>

//                 {/* Email */}
//                 <td>{employee.email || "-"}</td>

//                 {/* Phone */}
//                 <td>{employee.phone || "-"}</td>

//                 {/* Role */}
//                 <td>{employee.role || "-"}</td>

//                 {/* Department */}
//                 <td>{employee.department || "-"}</td>

//                 {/* Designation */}
//                 <td>{employee.designation || "-"}</td>

//                 {/* Joining Date */}
//                 <td>
//                   {employee.salaryDetails?.joiningDate
//                     ? new Date(
//                         employee.salaryDetails.joiningDate
//                       ).toLocaleDateString()
//                     : "-"}
//                 </td>

//                 {/* System Access */}
//                 <td>
//                   {employee.hasSystemAccess ? "YES" : "NO"}
//                 </td>

//                 {/* Status */}
//                 <td>
//                   <select
//                     value={employee.status}
//                     onChange={(e) =>
//                       changeStatus(employee._id, e.target.value)
//                     }
//                   >
//                     <option value="ACTIVE">ACTIVE</option>
//                     <option value="INACTIVE">INACTIVE</option>
//                     <option value="BLOCKED">BLOCKED</option>
//                     <option value="DELETED">DELETED</option>
//                   </select>
//                 </td>

//                 {/* Actions */}
//                 <td>

//                   <div
//                     style={{
//                       display: "flex",
//                       gap: "8px",
//                       alignItems: "center",
//                     }}
//                   >
//                     <button
//                       className="btn-edit"
//                       onClick={() =>
//                         navigate(
//                           `/admin/edit-employee/${employee._id}`
//                         )
//                       }
//                     >
//                       Edit
//                     </button>

//                     <button
//                       className="btn-salary"
//                       onClick={() =>
//                         setSelectedSalaryEmployeeId(employee._id)
//                       }
//                     >
//                       Salary
//                     </button>
//                   </div>

//                 </td>

//               </tr>
//             ))
//           )}

//         </tbody>

//       </table>

//       {selectedSalaryEmployeeId && (
//         <SalaryModal
//           employeeId={selectedSalaryEmployeeId}
//           onClose={() => setSelectedSalaryEmployeeId(null)}
//         />
//       )}

//     </div>
//   );
// }

// export default EmployeeList;


import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiUserCheck,
  FiSearch,
  FiEdit2,
  FiDollarSign,
  FiCalendar,
  FiMail,
  FiPhone,
  FiFilter,
  FiRefreshCw,
  FiBriefcase,
  FiShield
 
} from "react-icons/fi";

import "./EmployeeList.css";
import { updateEmployeeStatus } from "../../../services/authService";
import SalaryModal from "../../../components/Admin/Salary/SalaryModal";

const API_URL = import.meta.env.VITE_API_URL;

function EmployeeList() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedSalaryEmployeeId, setSelectedSalaryEmployeeId] =
    useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API_URL}/users/employees`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEmployees(res.data.data || []);
    } catch (error) {
      console.error("Employee fetch error:", error);
      alert("Unable to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      await updateEmployeeStatus(id, status);
      await fetchEmployees();
    } catch (error) {
      console.error("Status update error:", error);
      alert("Unable to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const fullName =
        `${employee.firstName || ""} ${employee.lastName || ""}`
          .toLowerCase();

      const searchMatch = [
        fullName,
        employee.employeeId,
        employee.email,
        employee.phone,
        employee.role,
        employee.department,
        employee.designation,
      ].some((value) =>
        String(value || "").toLowerCase().includes(search.toLowerCase())
      );

      const statusMatch =
        statusFilter === "ALL" ||
        employee.status === statusFilter;

      return searchMatch && statusMatch;
    });
  }, [employees, search, statusFilter]);

  const activeEmployees = employees.filter(
    (employee) => employee.status === "ACTIVE"
  ).length;

  const inactiveEmployees = employees.filter(
    (employee) => employee.status === "INACTIVE"
  ).length;

  const getInitials = (employee) => {
    return `${employee.firstName?.charAt(0) || ""}${
      employee.lastName?.charAt(0) || ""
    }`.toUpperCase() || "E";
  };

  const getStatusClass = (status) => {
    return (status || "inactive").toLowerCase();
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="employee-list-page">

      {/* PAGE HEADER */}
      <div className="employee-page-header">
        <div className="employee-header-content">
          <div className="employee-breadcrumb">
            Employees
          </div>

          <h1>Employee Management</h1>

          <p>
            Manage your workforce, employee details and system access.
          </p>
        </div>

        <button
          className="employee-refresh-btn"
          onClick={fetchEmployees}
          disabled={loading}
        >
          <FiRefreshCw className={loading ? "refresh-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* STATISTICS */}
      <div className="employee-stats-grid">

        <div className="employee-stat-card">
          <div className="employee-stat-icon total">
            <FiUsers />
          </div>

          <div className="employee-stat-info">
            <span>Total Employees</span>
            <h3>{employees.length}</h3>
            <small>Registered workforce</small>
          </div>
        </div>

        <div className="employee-stat-card">
          <div className="employee-stat-icon active">
            <FiUserCheck />
          </div>

          <div className="employee-stat-info">
            <span>Active Employees</span>
            <h3>{activeEmployees}</h3>
            <small>Currently active</small>
          </div>
        </div>

        <div className="employee-stat-card">
          <div className="employee-stat-icon inactive">
            <FiUsers />
          </div>

          <div className="employee-stat-info">
            <span>Inactive Employees</span>
            <h3>{inactiveEmployees}</h3>
            <small>Currently inactive</small>
          </div>
        </div>

      </div>

      {/* EMPLOYEE TABLE SECTION */}
      <div className="employee-content-card">

        <div className="employee-card-header">
          <div>
            <h2>All Employees</h2>
            <p>
              View and manage your employee directory.
            </p>
          </div>

          <div className="employee-total-badge">
            <FiUsers />
            {filteredEmployees.length} Employees
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="employee-toolbar">

          <div className="employee-search-box">
            <FiSearch />

            <input
              type="text"
              placeholder="Search name, ID, email, department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button
                className="employee-clear-search"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <div className="employee-filter-box">
            <FiFilter />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="BLOCKED">Blocked</option>
              <option value="DELETED">Deleted</option>
            </select>
          </div>

        </div>

        {/* DESKTOP TABLE */}
        <div className="employee-table-wrapper">

          <table className="employee-table">

            <thead>
              <tr>
                <th>EMPLOYEE</th>
                <th>CONTACT</th>
                <th>ROLE / DEPARTMENT</th>
                <th>DESIGNATION</th>
                <th>JOINING DATE</th>
                <th>SYSTEM ACCESS</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td colSpan="8" className="employee-table-message">
                    <div className="employee-loading">
                      <span className="employee-loader"></span>
                      Loading employees...
                    </div>
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="8" className="employee-table-message">
                    <div className="employee-empty-state">
                      <FiUsers />
                      <h3>No employees found</h3>
                      <p>
                        Try changing your search or status filter.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <tr key={employee._id}>

                    {/* EMPLOYEE */}
                    <td>
                      <div className="employee-profile-cell">

                        <div className="employee-avatar">
                          {getInitials(employee)}
                        </div>

                        <div className="employee-profile-info">
                          <strong>
                            {employee.firstName} {employee.lastName}
                          </strong>

                          <span>
                            ID: {employee.employeeId || "-"}
                          </span>
                        </div>

                      </div>
                    </td>

                    {/* CONTACT */}
                    <td>
                      <div className="employee-contact-cell">
                        <span>
                          <FiMail />
                          {employee.email || "-"}
                        </span>

                        <span>
                          <FiPhone />
                          {employee.phone || "-"}
                        </span>
                      </div>
                    </td>

                    {/* ROLE */}
                    <td>
                      <div className="employee-role-cell">
                        <strong>{employee.role || "-"}</strong>
                        <span>{employee.department || "-"}</span>
                      </div>
                    </td>

                    {/* DESIGNATION */}
                    <td>
                      <span className="employee-designation">
                        <FiBriefcase />
                        {employee.designation || "-"}
                      </span>
                    </td>

                    {/* JOINING DATE */}
                    <td>
                      <span className="employee-date">
                        <FiCalendar />
                        {formatDate(
                          employee.salaryDetails?.joiningDate
                        )}
                      </span>
                    </td>

                    {/* SYSTEM ACCESS */}
                    <td>
                      <span
                        className={`employee-access-badge ${
                          employee.hasSystemAccess
                            ? "access-yes"
                            : "access-no"
                        }`}
                      >
                        <FiShield />
                        {employee.hasSystemAccess ? "Enabled" : "Disabled"}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td>
                      <div
                        className={`employee-status ${
                          getStatusClass(employee.status)
                        }`}
                      >
                        <span className="employee-status-dot"></span>
                        {employee.status || "INACTIVE"}
                      </div>
                    </td>

                    {/* ACTIONS */}
                    <td>
                      <div className="employee-actions">

                        <button
                          className="employee-action-btn edit"
                          title="Edit Employee"
                          onClick={() =>
                            navigate(
                              `/admin/edit-employee/${employee._id}`
                            )
                          }
                        >
                          <FiEdit2 />
                        </button>

                        <button
                          className="employee-action-btn salary"
                          title="Manage Salary"
                          onClick={() =>
                            setSelectedSalaryEmployeeId(employee._id)
                          }
                        >
                          <FiDollarSign />
                        </button>

                        <select
                          className="employee-status-select"
                          value={employee.status || "INACTIVE"}
                          disabled={updatingId === employee._id}
                          onChange={(e) =>
                            changeStatus(employee._id, e.target.value)
                          }
                          title="Change employee status"
                        >
                          <option value="ACTIVE">Active</option>
                          <option value="INACTIVE">Inactive</option>
                          <option value="BLOCKED">Blocked</option>
                          <option value="DELETED">Deleted</option>
                        </select>

                      </div>
                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>
        </div>

        {/* MOBILE EMPLOYEE CARDS */}
        <div className="employee-mobile-list">

          {loading ? (
            <div className="employee-mobile-message">
              Loading employees...
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="employee-mobile-message">
              No employees found.
            </div>
          ) : (
            filteredEmployees.map((employee) => (
              <div className="employee-mobile-card" key={employee._id}>

                <div className="employee-mobile-top">
                  <div className="employee-profile-cell">
                    <div className="employee-avatar">
                      {getInitials(employee)}
                    </div>

                    <div className="employee-profile-info">
                      <strong>
                        {employee.firstName} {employee.lastName}
                      </strong>
                      <span>{employee.employeeId || "No Employee ID"}</span>
                    </div>
                  </div>

                  <div
                    className={`employee-status ${
                      getStatusClass(employee.status)
                    }`}
                  >
                    <span className="employee-status-dot"></span>
                    {employee.status || "INACTIVE"}
                  </div>
                </div>

                <div className="employee-mobile-details">

                  <div>
                    <FiMail />
                    <span>{employee.email || "-"}</span>
                  </div>

                  <div>
                    <FiPhone />
                    <span>{employee.phone || "-"}</span>
                  </div>

                  <div>
                    <FiBriefcase />
                    <span>
                      {employee.designation || employee.role || "-"}
                    </span>
                  </div>

                  <div>
                    <FiCalendar />
                    <span>
                      {formatDate(employee.salaryDetails?.joiningDate)}
                    </span>
                  </div>

                  <div>
                    <FiShield />
                    <span>
                      System access:{" "}
                      {employee.hasSystemAccess ? "Enabled" : "Disabled"}
                    </span>
                  </div>

                </div>

                <div className="employee-mobile-footer">

                  <select
                    className="employee-status-select"
                    value={employee.status || "INACTIVE"}
                    disabled={updatingId === employee._id}
                    onChange={(e) =>
                      changeStatus(employee._id, e.target.value)
                    }
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="BLOCKED">Blocked</option>
                    <option value="DELETED">Deleted</option>
                  </select>

                  <button
                    className="employee-mobile-action edit"
                    onClick={() =>
                      navigate(`/admin/edit-employee/${employee._id}`)
                    }
                  >
                    <FiEdit2 />
                    Edit
                  </button>

                  <button
                    className="employee-mobile-action salary"
                    onClick={() =>
                      setSelectedSalaryEmployeeId(employee._id)
                    }
                  >
                    <FiDollarSign />
                    Salary
                  </button>

                </div>

              </div>
            ))
          )}

        </div>

        {/* TABLE FOOTER */}
        {!loading && employees.length > 0 && (
          <div className="employee-table-footer">
            Showing <strong>{filteredEmployees.length}</strong> of{" "}
            <strong>{employees.length}</strong> employees
          </div>
        )}

      </div>

      {/* SALARY MODAL */}
      {selectedSalaryEmployeeId && (
        <SalaryModal
          employeeId={selectedSalaryEmployeeId}
          onClose={() => setSelectedSalaryEmployeeId(null)}
        />
      )}

    </div>
  );
}

export default EmployeeList;
