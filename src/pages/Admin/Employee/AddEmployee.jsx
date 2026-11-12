

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiUser,
  FiUsers,
  FiMail,
  FiPhone,
  FiLock,
  FiBriefcase,
  FiShield,
  FiCreditCard,
  FiCalendar,
  FiClock,
  FiHash,
  FiDollarSign,
  FiCheckCircle,
  FiUserPlus,
  FiMapPin,
  FiKey,
} from "react-icons/fi";

import { createEmployee } from "../../../services/authService";
import { getShifts } from "../../../services/shiftService";
import { toast } from "react-toastify";
import "./AddEmployee.css";

// ======================================================
// DEFAULT SHIFTS
// ======================================================

const DEFAULT_SHIFTS = [
  {
    _id: "650000000000000000000001",
    name: "Morning Shift",
    startTime: "09:00 AM",
    endTime: "05:00 PM",
  },
  {
    _id: "650000000000000000000002",
    name: "Evening Shift",
    startTime: "02:00 PM",
    endTime: "10:00 PM",
  },
  {
    _id: "650000000000000000000003",
    name: "Night Shift",
    startTime: "10:00 PM",
    endTime: "06:00 AM",
  },
];

// ======================================================
// EMPTY EMPLOYEE
// ======================================================

const EMPTY_EMPLOYEE = {
  hasSystemAccess: true,
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  role: "SALES",
  department: "FRONT_DESK",
  designation: "",
  salaryType: "MONTHLY",
  amount: "",
  joiningDate: "",
  biometricId: "",
  shift: "",
  bankDetails: {
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    branchName: "",
    accountType: "SAVINGS",
  },
};

// ======================================================
// REUSABLE FIELD
// ======================================================

function FormField({
  label,
  icon: Icon,
  required = false,
  hint,
  children,
  className = "",
}) {
  return (
    <div className={`add-employee-field ${className}`}>
      <label className="add-employee-label">
        {label}
        {required && <span className="required-star">*</span>}
      </label>

      <div className="add-employee-input-wrap">
        {Icon && (
          <span className="add-employee-input-icon">
            <Icon />
          </span>
        )}

        {children}
      </div>

      {hint && (
        <small className="add-employee-hint">{hint}</small>
      )}
    </div>
  );
}

// ======================================================
// SECTION HEADER
// ======================================================

function SectionHeader({ icon: Icon, title, description, number }) {
  return (
    <div className="add-employee-section-heading">
      <div className="add-employee-section-icon">
        <Icon />
      </div>

      <div className="add-employee-section-title">
        <div className="add-employee-section-title-row">
          <h3>{title}</h3>
          <span className="add-employee-section-number">{number}</span>
        </div>

        <p>{description}</p>
      </div>
    </div>
  );
}

// ======================================================
// MAIN COMPONENT
// ======================================================

function AddEmployee() {
  const navigate = useNavigate();

  const [shifts, setShifts] = useState([]);
  const [employee, setEmployee] = useState(EMPTY_EMPLOYEE);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ======================================================
  // FETCH SHIFTS
  // ======================================================

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const res = await getShifts();

        const shiftList =
          res?.data?.data ||
          res?.data ||
          [];

        setShifts(
          Array.isArray(shiftList) ? shiftList : []
        );
      } catch (error) {
        console.error("Failed to fetch shifts:", error);
        setShifts([]);
      }
    };

    fetchShifts();
  }, []);

  // ======================================================
  // AVAILABLE SHIFTS
  // ======================================================

  const availableShifts =
    shifts.length > 0 ? shifts : DEFAULT_SHIFTS;

  // ======================================================
  // INPUT CHANGE
  // ======================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setEmployee((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ======================================================
  // BANK INPUT CHANGE
  // ======================================================

  const handleBankChange = (e) => {
    const { name, value } = e.target;

    setEmployee((prev) => ({
      ...prev,
      bankDetails: {
        ...prev.bankDetails,
        [name]:
          name === "ifscCode"
            ? value.toUpperCase()
            : value,
      },
    }));
  };

  // ======================================================
  // BANK VALIDATION
  // ======================================================

  const validateBankDetails = () => {
    const bank = employee.bankDetails;

    const hasAnyBankValue =
      bank.accountHolderName.trim() ||
      bank.accountNumber.trim() ||
      bank.ifscCode.trim() ||
      bank.bankName.trim() ||
      bank.branchName.trim();

    if (!hasAnyBankValue) return true;

    if (!bank.accountHolderName.trim()) {
      toast.error("Please enter account holder name");
      return false;
    }

    if (!bank.accountNumber.trim()) {
      toast.error("Please enter account number");
      return false;
    }

    if (!bank.ifscCode.trim()) {
      toast.error("Please enter IFSC code");
      return false;
    }

    if (!bank.bankName.trim()) {
      toast.error("Please enter bank name");
      return false;
    }

    return true;
  };

  // ======================================================
  // SUBMIT
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    // BASIC VALIDATION

    if (!employee.firstName.trim()) {
      toast.error("Please enter first name");
      return;
    }

    if (!employee.lastName.trim()) {
      toast.error("Please enter last name");
      return;
    }

    if (!employee.phone.trim()) {
      toast.error("Please enter phone number");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(employee.phone.trim())) {
      toast.error("Please enter valid 10 digit phone number");
      return;
    }

    // SYSTEM ACCESS VALIDATION

    if (employee.hasSystemAccess) {
      if (!employee.email.trim()) {
        toast.error("Please enter email");
        return;
      }

      if (!employee.password.trim()) {
        toast.error("Please enter password");
        return;
      }

      if (!employee.role) {
        toast.error("Please select employee role");
        return;
      }
    }

    // EMAIL VALIDATION

    if (employee.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(employee.email.trim())) {
        toast.error("Please enter valid email address");
        return;
      }
    }

    // DESIGNATION

    if (!employee.designation.trim()) {
      toast.error("Please enter designation");
      return;
    }

    // SALARY

    if (!employee.amount) {
      toast.error("Please enter salary amount");
      return;
    }

    if (Number(employee.amount) <= 0) {
      toast.error("Salary amount must be greater than 0");
      return;
    }

    // JOINING DATE

    if (!employee.joiningDate) {
      toast.error("Please select joining date");
      return;
    }

    // BANK VALIDATION

    if (!validateBankDetails()) return;

    // BANK PAYLOAD

    const bank = employee.bankDetails;

    const hasBankDetails = Boolean(
      bank.accountHolderName.trim() ||
      bank.accountNumber.trim() ||
      bank.ifscCode.trim() ||
      bank.bankName.trim() ||
      bank.branchName.trim()
    );

    // CREATE PAYLOAD

    const payload = {
      hasSystemAccess: Boolean(employee.hasSystemAccess),

      firstName: employee.firstName.trim(),
      lastName: employee.lastName.trim(),
      phone: employee.phone.trim(),

      designation: employee.designation.trim(),
      department: employee.department,

      salaryDetails: {
        salaryType: employee.salaryType,
        amount: Number(employee.amount),
        joiningDate: employee.joiningDate,
      },

      biometricId: employee.biometricId
        ? String(employee.biometricId)
        : undefined,

      shift: employee.shift || null,

      ...(employee.email.trim()
        ? { email: employee.email.trim() }
        : {}),

      ...(hasBankDetails
        ? {
            bankDetails: {
              accountHolderName: bank.accountHolderName.trim(),
              accountNumber: bank.accountNumber.trim(),
              ifscCode: bank.ifscCode.trim().toUpperCase(),
              bankName: bank.bankName.trim(),
              branchName: bank.branchName.trim(),
              accountType: bank.accountType || "SAVINGS",
            },
          }
        : {}),
    };

    // LOGIN DETAILS

    if (employee.hasSystemAccess) {
      payload.password = employee.password;
      payload.role = employee.role;
    }

    // API CALL

    try {
      setSubmitting(true);

      console.log("CREATE EMPLOYEE PAYLOAD:", payload);

      const res = await createEmployee(payload);

      console.log("CREATE EMPLOYEE RESPONSE:", res);

      toast.success(
        res?.data?.message ||
        "Employee created successfully!"
      );

      // SYSTEM ACCESS EMPLOYEE

      if (employee.hasSystemAccess) {
        const verificationEmail =
          res?.data?.data?.email ||
          res?.data?.email ||
          res?.data?.user?.email ||
          payload.email;

        if (!verificationEmail) {
          toast.error(
            "Employee created but verification email was not found."
          );
          return;
        }

        localStorage.setItem(
          "verificationEmail",
          verificationEmail
        );

        localStorage.removeItem("verificationOtp");

        setTimeout(() => {
          navigate("/verify-email");
        }, 500);
      } else {
        // EMPLOYEE WITHOUT SYSTEM ACCESS

        setEmployee({
          ...EMPTY_EMPLOYEE,
          bankDetails: {
            accountHolderName: "",
            accountNumber: "",
            ifscCode: "",
            bankName: "",
            branchName: "",
            accountType: "SAVINGS",
          },
        });

        setShowPassword(false);
      }
    } catch (error) {
      console.error("CREATE EMPLOYEE ERROR:", error);
      console.error(
        "CREATE EMPLOYEE ERROR RESPONSE:",
        error?.response?.data
      );

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Unable To Create Employee";

      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  // ======================================================
  // DEPARTMENT LOGIC
  // ======================================================

  useEffect(() => {
    setEmployee((prev) => ({
      ...prev,
      department: prev.hasSystemAccess
        ? prev.department === "OTHER"
          ? "FRONT_DESK"
          : prev.department
        : "OTHER",
    }));
  }, [employee.hasSystemAccess]);

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="add-employee-page">

      {/* PAGE HEADER */}

      <div className="add-employee-header">
        <div className="add-employee-header-left">
          <button
            type="button"
            className="add-employee-back-btn"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <FiArrowLeft />
          </button>

          <div>
            <div className="add-employee-breadcrumb">
              Administration <span>/</span> Employees <span>/</span> Add Employee
            </div>

            <h1>Create Employee</h1>

            <p>
              Add a new team member and configure their employment details.
            </p>
          </div>
        </div>

        <div className="add-employee-header-badge">
          <FiUserPlus />
          New Employee
        </div>
      </div>

      <form
        className="add-employee-form"
        onSubmit={handleSubmit}
      >

        {/* ACCESS CONTROL */}

        <div className="add-employee-access-card">

          <div className="add-employee-access-left">
            <div className="add-employee-access-icon">
              <FiShield />
            </div>

            <div>
              <h3>System Access</h3>
              <p>
                Allow this employee to log in and access the system.
              </p>
            </div>
          </div>

          <label className="add-employee-toggle">
            <input
              type="checkbox"
              name="hasSystemAccess"
              checked={employee.hasSystemAccess}
              onChange={handleChange}
            />
            <span className="add-employee-toggle-slider"></span>
          </label>

          <span
            className={`add-employee-access-status ${
              employee.hasSystemAccess ? "enabled" : "disabled"
            }`}
          >
            {employee.hasSystemAccess ? "Login Enabled" : "No Login Access"}
          </span>

        </div>

        {/* MAIN FORM GRID */}

        <div className="add-employee-main-grid">

          {/* LEFT COLUMN */}

          <div className="add-employee-left-column">

            {/* PERSONAL INFORMATION */}

            <section className="add-employee-section">

              <SectionHeader
                icon={FiUser}
                number="01"
                title="Personal Information"
                description="Enter the employee's basic contact information."
              />

              <div className="add-employee-fields-grid">

                <FormField
                  label="First Name"
                  icon={FiUser}
                  required
                >
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Enter first name"
                    value={employee.firstName}
                    onChange={handleChange}
                    required
                  />
                </FormField>

                <FormField
                  label="Last Name"
                  icon={FiUser}
                  required
                >
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Enter last name"
                    value={employee.lastName}
                    onChange={handleChange}
                    required
                  />
                </FormField>

                <FormField
                  label="Phone Number"
                  icon={FiPhone}
                  required
                  hint="Enter a valid 10-digit mobile number."
                >
                  <input
                    type="tel"
                    name="phone"
                    placeholder="10-digit mobile number"
                    value={employee.phone}
                    onChange={handleChange}
                    maxLength={10}
                    inputMode="numeric"
                    required
                  />
                </FormField>

                <FormField
                  label="Email Address"
                  icon={FiMail}
                  required={employee.hasSystemAccess}
                  hint={
                    employee.hasSystemAccess
                      ? "Used for account verification and login."
                      : "Optional for employees without system access."
                  }
                >
                  <input
                    type="email"
                    name="email"
                    placeholder="employee@company.com"
                    value={employee.email}
                    onChange={handleChange}
                    required={employee.hasSystemAccess}
                  />
                </FormField>

              </div>
            </section>

            {/* LOGIN INFORMATION */}

            {employee.hasSystemAccess && (
              <section className="add-employee-section">

                <SectionHeader
                  icon={FiKey}
                  number="02"
                  title="Login Credentials"
                  description="Configure account credentials and system permissions."
                />

                <div className="add-employee-fields-grid">

                  <FormField
                    label="Password"
                    icon={FiLock}
                    required
                    className="password-field"
                  >
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter account password"
                      value={employee.password}
                      onChange={handleChange}
                      required
                    />

                    <button
                      type="button"
                      className="add-employee-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </FormField>

                  <FormField
                    label="Employee Role"
                    icon={FiShield}
                    required
                  >
                    <select
                      name="role"
                      value={employee.role}
                      onChange={handleChange}
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="SALES">Sales</option>
                      <option value="TECHNICIAN">Technician</option>
                      <option value="INVENTORY">Inventory</option>
                      <option value="ACCOUNTANT">Accountant</option>
                      <option value="HR_EXECUTIVE">HR</option>
                      <option value="IT_SUPPORT">IT Support</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </FormField>

                </div>

                <div className="add-employee-info-note">
                  <FiShield />
                  <span>
                    System access is enabled. This employee will receive an
                    email verification request after creation.
                  </span>
                </div>

              </section>
            )}

            {/* EMPLOYMENT INFORMATION */}

            <section className="add-employee-section">

              <SectionHeader
                icon={FiBriefcase}
                number={employee.hasSystemAccess ? "03" : "02"}
                title="Employment Details"
                description="Set the employee's role, department and work schedule."
              />

              <div className="add-employee-fields-grid">

                <FormField
                  label="Department"
                  icon={FiBuilding}
                  required
                >
                  <select
                    name="department"
                    value={employee.department}
                    onChange={handleChange}
                  >
                    {employee.hasSystemAccess ? (
                      <>
                        <option value="ADMINISTRATION">Administration</option>
                        <option value="FRONT_DESK">Front Desk</option>
                        <option value="REPAIR">Repair</option>
                        <option value="INVENTORY">Inventory</option>
                        <option value="ACCOUNTS">Accounts</option>
                        <option value="HR">HR</option>
                        <option value="IT_SUPPORT">IT Support</option>
                      </>
                    ) : (
                      <option value="OTHER">Other</option>
                    )}
                  </select>
                </FormField>

                <FormField
                  label="Designation"
                  icon={FiBriefcase}
                  required
                >
                  <input
                    type="text"
                    name="designation"
                    placeholder="e.g. Senior Technician"
                    value={employee.designation}
                    onChange={handleChange}
                    required
                  />
                </FormField>

                <FormField
                  label="Biometric ID"
                  icon={FiHash}
                  hint="Optional employee attendance ID."
                >
                  <input
                    type="text"
                    name="biometricId"
                    placeholder="Enter biometric ID"
                    value={employee.biometricId}
                    onChange={handleChange}
                  />
                </FormField>

                <FormField
                  label="Work Shift"
                  icon={FiClock}
                >
                  <select
                    name="shift"
                    value={employee.shift}
                    onChange={handleChange}
                  >
                    <option value="">Select work shift</option>

                    {availableShifts.map((shift) => (
                      <option
                        key={shift._id}
                        value={shift._id}
                      >
                        {shift.name || "Shift"} ({shift.startTime} - {shift.endTime})
                      </option>
                    ))}
                  </select>
                </FormField>

              </div>
            </section>

          </div>

          {/* RIGHT COLUMN */}

          <div className="add-employee-right-column">

            {/* SALARY DETAILS */}

            <section className="add-employee-section">

              <SectionHeader
                icon={FiDollarSign}
                number={employee.hasSystemAccess ? "04" : "03"}
                title="Salary Information"
                description="Configure employee compensation details."
              />

              <div className="add-employee-fields-grid single-column">

                <FormField
                  label="Salary Type"
                  icon={FiDollarSign}
                  required
                >
                  <select
                    name="salaryType"
                    value={employee.salaryType}
                    onChange={handleChange}
                  >
                    <option value="MONTHLY">Monthly Salary</option>
                    <option value="DAILY">Daily Salary</option>
                  </select>
                </FormField>

                <FormField
                  label="Salary Amount (₹)"
                  icon={FiDollarSign}
                  required
                >
                  <input
                    type="number"
                    name="amount"
                    placeholder="Enter salary amount"
                    value={employee.amount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </FormField>

                <FormField
                  label="Joining Date"
                  icon={FiCalendar}
                  required
                >
                  <input
                    type="date"
                    name="joiningDate"
                    value={employee.joiningDate}
                    onChange={handleChange}
                    required
                  />
                </FormField>

              </div>

              <div className="add-employee-salary-note">
                <FiCalendar />
                <span>
                  Salary and joining date will be saved in employee salary details.
                </span>
              </div>

            </section>

            {/* BANK DETAILS */}

            <section className="add-employee-section">

              <SectionHeader
                icon={FiCreditCard}
                number={employee.hasSystemAccess ? "05" : "04"}
                title="Bank Details"
                description="Optional information for employee salary payments."
              />

              <div className="add-employee-bank-fields">

                <FormField
                  label="Account Holder Name"
                  icon={FiUser}
                >
                  <input
                    type="text"
                    name="accountHolderName"
                    placeholder="Name as per bank account"
                    value={employee.bankDetails.accountHolderName}
                    onChange={handleBankChange}
                  />
                </FormField>

                <FormField
                  label="Bank Name"
                  icon={FiBuilding}
                >
                  <input
                    type="text"
                    name="bankName"
                    placeholder="Enter bank name"
                    value={employee.bankDetails.bankName}
                    onChange={handleBankChange}
                  />
                </FormField>

                <FormField
                  label="Account Number"
                  icon={FiCreditCard}
                >
                  <input
                    type="text"
                    name="accountNumber"
                    placeholder="Enter account number"
                    value={employee.bankDetails.accountNumber}
                    onChange={handleBankChange}
                    inputMode="numeric"
                  />
                </FormField>

                <FormField
                  label="IFSC Code"
                  icon={FiHash}
                >
                  <input
                    type="text"
                    name="ifscCode"
                    placeholder="e.g. SBIN0001234"
                    value={employee.bankDetails.ifscCode}
                    onChange={handleBankChange}
                    maxLength={11}
                    style={{ textTransform: "uppercase" }}
                  />
                </FormField>

                <FormField
                  label="Branch Name"
                  icon={FiMapPin}
                >
                  <input
                    type="text"
                    name="branchName"
                    placeholder="Enter branch name"
                    value={employee.bankDetails.branchName}
                    onChange={handleBankChange}
                  />
                </FormField>

                <FormField
                  label="Account Type"
                  icon={FiCreditCard}
                >
                  <select
                    name="accountType"
                    value={employee.bankDetails.accountType}
                    onChange={handleBankChange}
                  >
                    <option value="SAVINGS">Savings Account</option>
                    <option value="CURRENT">Current Account</option>
                  </select>
                </FormField>

              </div>

              <div className="add-employee-bank-note">
                <FiShield />
                <span>
                  Bank details are optional. Complete all required bank fields
                  when providing account information.
                </span>
              </div>

            </section>

          </div>
        </div>

        {/* FORM FOOTER */}

        <div className="add-employee-form-footer">

          <div className="add-employee-footer-info">
            <FiCheckCircle />
            <span>
              Fields marked with <b>*</b> are required.
            </span>
          </div>

          <div className="add-employee-footer-actions">

            <button
              type="button"
              className="add-employee-cancel-btn"
              onClick={() => navigate(-1)}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="add-employee-submit-btn"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="add-employee-button-loader"></span>
                  Creating Employee...
                </>
              ) : (
                <>
                  <FiUserPlus />
                  {employee.hasSystemAccess
                    ? "Create & Verify Employee"
                    : "Create Employee"}
                </>
              )}
            </button>

          </div>
        </div>

      </form>
    </div>
  );
}

export default AddEmployee;
