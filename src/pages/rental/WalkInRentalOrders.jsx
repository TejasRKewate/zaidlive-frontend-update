// import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./WalkInRentalOrders.css";

// import { getAllRentals } from "../../services/rentalApi";

// function WalkInRentalOrders() {
//     const navigate = useNavigate();

//     const [rentals, setRentals] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

//     const [search, setSearch] = useState("");
//     const [selectedDate, setSelectedDate] = useState("");
//     const [statusFilter, setStatusFilter] = useState("ALL");

//     // =====================================================
//     // LOAD RENTALS
//     // =====================================================

//     useEffect(() => {
//         loadWalkInRentals();
//     }, []);

//     const loadWalkInRentals = async () => {
//         try {
//             setLoading(true);
//             setError("");

//             console.log("================================");
//             console.log("LOADING WALK-IN RENTALS");
//             console.log("================================");

//             const response = await getAllRentals();

//             console.log("ALL RENTALS RESPONSE:", response);

//             let list = [];

//             // ---------------------------------------------
//             // SUPPORT MULTIPLE RESPONSE STRUCTURES
//             // ---------------------------------------------

//             if (Array.isArray(response)) {
//                 list = response;
//             } else if (Array.isArray(response?.rentals)) {
//                 list = response.rentals;
//             } else if (Array.isArray(response?.data)) {
//                 list = response.data;
//             } else if (Array.isArray(response?.data?.rentals)) {
//                 list = response.data.rentals;
//             } else if (Array.isArray(response?.data?.data)) {
//                 list = response.data.data;
//             } else if (Array.isArray(response?.result)) {
//                 list = response.result;
//             } else if (Array.isArray(response?.data?.result)) {
//                 list = response.data.result;
//             }

//             console.log("ALL RENTALS:", list);

//             // ---------------------------------------------
//             // ONLY WALK-IN RENTALS
//             // ---------------------------------------------

//             const walkInRentals = list.filter((rental) => {
//                 return (
//                     String(rental?.rentalSource || "")
//                         .trim()
//                         .toUpperCase() === "WALK_IN"
//                 );
//             });

//             console.log(
//                 "ONLY WALK-IN RENTALS:",
//                 walkInRentals
//             );

//             setRentals(walkInRentals);
//         } catch (err) {
//             console.error(
//                 "WALK-IN RENTALS ERROR:",
//                 err
//             );

//             setError(
//                 err?.response?.data?.message ||
//                 err?.message ||
//                 "Failed to load walk-in rental orders"
//             );

//             setRentals([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // =====================================================
//     // CUSTOMER NAME
//     // =====================================================

//     const getCustomerName = (rental) => {
//         if (
//             String(rental?.customerType || "")
//                 .toUpperCase() === "COMPANY"
//         ) {
//             return (
//                 rental?.companyDetails?.contactPerson ||
//                 rental?.companyDetails?.companyName ||
//                 "Company Customer"
//             );
//         }

//         return (
//             rental?.individualDetails?.fullName ||
//             rental?.customer?.name ||
//             rental?.customer?.fullName ||
//             "Walk-In Customer"
//         );
//     };

//     // =====================================================
//     // PHONE
//     // =====================================================

//     const getCustomerPhone = (rental) => {
//         if (
//             String(rental?.customerType || "")
//                 .toUpperCase() === "COMPANY"
//         ) {
//             return (
//                 rental?.companyDetails?.phone ||
//                 "-"
//             );
//         }

//         return (
//             rental?.individualDetails?.phone ||
//             rental?.customer?.phone ||
//             "-"
//         );
//     };

//     // =====================================================
//     // EMAIL
//     // =====================================================

//     const getCustomerEmail = (rental) => {
//         if (
//             String(rental?.customerType || "")
//                 .toUpperCase() === "COMPANY"
//         ) {
//             return (
//                 rental?.companyDetails?.email ||
//                 "-"
//             );
//         }

//         return (
//             rental?.individualDetails?.email ||
//             rental?.customer?.email ||
//             "-"
//         );
//     };

//     // =====================================================
//     // PRODUCT NAME
//     // =====================================================

//     const getProductName = (rental) => {
//         return (
//             rental?.product?.name ||
//             rental?.product?.title ||
//             rental?.rentalProduct?.product?.name ||
//             rental?.rentalProduct?.product?.title ||
//             rental?.rentalProduct?.name ||
//             "Rental Product"
//         );
//     };

//     // =====================================================
//     // BRAND
//     // =====================================================

//     const getBrandName = (rental) => {
//         const brand =
//             rental?.product?.brand ||
//             rental?.rentalProduct?.product?.brand;

//         if (typeof brand === "object" && brand !== null) {
//             return (
//                 brand?.name ||
//                 brand?.title ||
//                 ""
//             );
//         }

//         return brand || "";
//     };

//     // =====================================================
//     // MONGODB RENTAL ID
//     // =====================================================

//     const getRentalId = (rental) => {
//         return (
//             rental?._id ||
//             rental?.id ||
//             rental?.rentalId ||
//             ""
//         );
//     };

//     // =====================================================
//     // RENTAL NUMBER
//     // =====================================================

//     const getRentalNumber = (rental) => {
//         return (
//             rental?.rentalNumber ||
//             rental?.rentalNo ||
//             rental?.rental_number ||
//             getRentalId(rental)
//         );
//     };

//     // =====================================================
//     // MONTHLY RENT
//     // =====================================================

//     const getMonthlyRent = (rental) => {
//         return Number(
//             rental?.monthlyRent ??
//             rental?.rentalProduct?.monthlyRent ??
//             0
//         );
//     };

//     // =====================================================
//     // RENTAL DURATION TYPE
//     // =====================================================

//     const getRentalDurationType = (rental) => {
//         return String(
//             rental?.rentalDurationType ||
//             "MONTHS"
//         ).toUpperCase();
//     };

//     // =====================================================
//     // RENTAL DURATION
//     // =====================================================

//     const getRentalDuration = (rental) => {
//         const type =
//             getRentalDurationType(rental);

//         const duration = Number(
//             rental?.rentalDuration ??
//             rental?.rentalMonths ??
//             1
//         );

//         return {
//             value: duration,
//             type:
//                 type === "DAYS"
//                     ? "days"
//                     : "months",
//         };
//     };

//     // =====================================================
//     // SECURITY DEPOSIT
//     // =====================================================

//     const getSecurityDeposit = (rental) => {
//         return Number(
//             rental?.securityDeposit ?? 0
//         );
//     };

//     // =====================================================
//     // ACTUAL DEPOSIT PAID
//     // =====================================================

//     // const getDepositAmountPaid = (rental) => {
//     //     return Number(
//     //         rental?.depositAmountPaid ?? 0
//     //     );
//     // };

//     const getDepositAmountPaid = (rental) => {
//     const possiblePaidAmounts = [
//         rental?.depositAmountPaid,
//         rental?.depositPaid,
//         rental?.securityDepositPaid,
//         rental?.paidDeposit,
//         rental?.deposit?.paidAmount,
//         rental?.deposit?.amountPaid,
//         rental?.payment?.depositAmount,
//         rental?.payment?.amount,
//     ];

//     for (const amount of possiblePaidAmounts) {
//         if (
//             amount !== undefined &&
//             amount !== null &&
//             amount !== "" &&
//             !Number.isNaN(Number(amount))
//         ) {
//             return Number(amount);
//         }
//     }

//     return 0;
// };




//     // =====================================================
//     // DEPOSIT STATUS
//     // =====================================================

//     // const getDepositPaymentStatus = (rental) => {
//     //     const status = String(
//     //         rental?.depositPaymentStatus || ""
//     //     ).toUpperCase();

//     //     if (
//     //         status === "PAID" ||
//     //         status === "PARTIAL" ||
//     //         status === "UNPAID"
//     //     ) {
//     //         return status;
//     //     }

//     //     const expected =
//     //         getSecurityDeposit(rental);

//     //     const paid =
//     //         getDepositAmountPaid(rental);

//     //     if (expected > 0 && paid >= expected) {
//     //         return "PAID";
//     //     }

//     //     if (paid > 0) {
//     //         return "PARTIAL";
//     //     }

//     //     return "UNPAID";
//     // };

//     const getDepositPaymentStatus = (rental) => {
//     const expected = getSecurityDeposit(rental);
//     const paid = getDepositAmountPaid(rental);

//     // Backend ka direct status agar available hai
//     const backendStatus = String(
//         rental?.depositPaymentStatus ||
//         rental?.depositStatus ||
//         rental?.securityDepositStatus ||
//         ""
//     )
//         .trim()
//         .toUpperCase();

//     // Agar backend explicitly PAID bhej raha hai
//     if (backendStatus === "PAID") {
//         return "PAID";
//     }

//     // Agar backend explicitly PARTIAL bhej raha hai
//     if (backendStatus === "PARTIAL") {
//         return "PARTIAL";
//     }

//     // Agar expected deposit hi nahi hai
//     if (expected <= 0) {
//         return paid > 0 ? "PAID" : "UNPAID";
//     }

//     // Amount ke basis par actual status
//     if (paid >= expected) {
//         return "PAID";
//     }

//     if (paid > 0) {
//         return "PARTIAL";
//     }

//     return "UNPAID";
// };

//     // =====================================================
//     // GST
//     // =====================================================

//     const getGSTPercentage = (rental) => {
//         return Number(
//             rental?.gstPercentage ??
//             rental?.gst ??
//             0
//         );
//     };

//     // =====================================================
//     // TOTAL RENT
//     // =====================================================

//     const getTotalRent = (rental) => {
//         const monthlyRent =
//             getMonthlyRent(rental);

//         const type =
//             getRentalDurationType(rental);

//         const duration = Number(
//             rental?.rentalDuration ??
//             rental?.rentalMonths ??
//             1
//         );

//         // ---------------------------------------------
//         // DAILY RENT
//         // ---------------------------------------------

//         if (type === "DAYS") {
//             return (
//                 (monthlyRent / 30) *
//                 duration
//             );
//         }

//         // ---------------------------------------------
//         // MONTHLY RENT
//         // ---------------------------------------------

//         return (
//             monthlyRent *
//             duration
//         );
//     };

//     // =====================================================
//     // GST AMOUNT
//     // =====================================================

//     const getGSTAmount = (rental) => {
//         const totalRent =
//             getTotalRent(rental);

//         const gstPercentage =
//             getGSTPercentage(rental);

//         return (
//             totalRent *
//             gstPercentage /
//             100
//         );
//     };

//     // =====================================================
//     // TOTAL WITH GST
//     // =====================================================

//     const getTotalWithGST = (rental) => {
//         return (
//             getTotalRent(rental) +
//             getGSTAmount(rental)
//         );
//     };

//     // =====================================================
//     // STATUS
//     // =====================================================

//     const getStatus = (rental) => {
//         return String(
//             rental?.status || "PENDING"
//         ).toUpperCase();
//     };

//     // =====================================================
//     // STATUS CLASS
//     // =====================================================

//     const getStatusClass = (status) => {
//         switch (
//             String(status || "")
//                 .toUpperCase()
//         ) {
//             case "ACTIVE":
//                 return "active";

//             case "RETURNED":
//                 return "returned";

//             case "COMPLETED":
//                 return "completed";

//             case "PENDING":
//                 return "pending";

//             case "DOCUMENT_VERIFICATION":
//                 return "pending";

//             case "APPROVED":
//                 return "pending";

//             case "DEPOSIT_PENDING":
//                 return "pending";

//             case "READY_FOR_ALLOCATION":
//                 return "pending";

//             case "RETURN_REQUESTED":
//                 return "pending";

//             case "SETTLEMENT_PENDING":
//                 return "pending";

//             case "REJECTED":
//             case "CANCELLED":
//                 return "cancelled";

//             default:
//                 return "default";
//         }
//     };

//     // =====================================================
//     // DEPOSIT STATUS CLASS
//     // =====================================================

//     const getDepositStatusClass = (status) => {
//         switch (
//             String(status || "")
//                 .toUpperCase()
//         ) {
//             case "PAID":
//                 return "deposit-paid";

//             case "PARTIAL":
//                 return "deposit-partial";

//             case "UNPAID":
//             default:
//                 return "deposit-unpaid";
//         }
//     };

//     // =====================================================
//     // FORMAT MONEY
//     // =====================================================

//     const formatMoney = (value) => {
//         return Number(
//             value || 0
//         ).toLocaleString(
//             "en-IN",
//             {
//                 maximumFractionDigits: 2,
//             }
//         );
//     };

//     // =====================================================
//     // FILTER RENTALS
//     // =====================================================

//     const filteredRentals = useMemo(() => {
//         let result = [...rentals];

//         // ---------------------------------------------
//         // SEARCH
//         // ---------------------------------------------

//         if (search.trim()) {
//             const keyword =
//                 search.trim().toLowerCase();

//             result = result.filter((rental) => {
//                 const rentalId =
//                     String(
//                         getRentalId(rental)
//                     ).toLowerCase();

//                 const rentalNumber =
//                     String(
//                         getRentalNumber(rental)
//                     ).toLowerCase();

//                 const customer =
//                     getCustomerName(
//                         rental
//                     ).toLowerCase();

//                 const phone =
//                     getCustomerPhone(
//                         rental
//                     ).toLowerCase();

//                 const email =
//                     getCustomerEmail(
//                         rental
//                     ).toLowerCase();

//                 const product =
//                     getProductName(
//                         rental
//                     ).toLowerCase();

//                 return (
//                     rentalId.includes(keyword) ||
//                     rentalNumber.includes(keyword) ||
//                     customer.includes(keyword) ||
//                     phone.includes(keyword) ||
//                     email.includes(keyword) ||
//                     product.includes(keyword)
//                 );
//             });
//         }

//         // ---------------------------------------------
//         // DATE
//         // ---------------------------------------------

//         if (selectedDate) {
//             result = result.filter((rental) => {
//                 if (!rental?.createdAt) {
//                     return false;
//                 }

//                 const rentalDate =
//                     new Date(
//                         rental.createdAt
//                     )
//                         .toISOString()
//                         .split("T")[0];

//                 return (
//                     rentalDate ===
//                     selectedDate
//                 );
//             });
//         }

//         // ---------------------------------------------
//         // STATUS
//         // ---------------------------------------------

//         if (statusFilter !== "ALL") {
//             result = result.filter((rental) => {
//                 return (
//                     getStatus(rental) ===
//                     statusFilter
//                 );
//             });
//         }

//         return result;
//     }, [
//         rentals,
//         search,
//         selectedDate,
//         statusFilter,
//     ]);

//     // =====================================================
//     // SUMMARY
//     // =====================================================

//     const totalRent =
//         filteredRentals.reduce(
//             (sum, rental) =>
//                 sum +
//                 getTotalWithGST(rental),
//             0
//         );

//     const totalDeposit =
//         filteredRentals.reduce(
//             (sum, rental) =>
//                 sum +
//                 getSecurityDeposit(rental),
//             0
//         );

//     const totalDepositPaid =
//         filteredRentals.reduce(
//             (sum, rental) =>
//                 sum +
//                 getDepositAmountPaid(rental),
//             0
//         );

//     const activeRentals =
//         filteredRentals.filter(
//             (rental) =>
//                 getStatus(rental) ===
//                 "ACTIVE"
//         ).length;

//     // =====================================================
//     // VIEW
//     // =====================================================

//     const viewRental = (rental) => {
//         const rentalId =
//             getRentalId(rental);

//         if (!rentalId) {
//             console.error(
//                 "Rental ID missing:",
//                 rental
//             );

//             return;
//         }

//         navigate(
//             `/receptionist-dashboard/rental/orders/${rentalId}`,
//             {
//                 state: {
//                     rental,
//                 },
//             }
//         );
//     };

//     // =====================================================
//     // NEW RENTAL
//     // =====================================================

//     const createNewRental = () => {
//         navigate(
//             "/receptionist-dashboard/rental/new"
//         );
//     };

//     // =====================================================
//     // INVOICE
//     // =====================================================

//     const printInvoice = (rental) => {
//         const rentalId =
//             getRentalId(rental);

//         if (!rentalId) {
//             alert(
//                 "Rental ID not found"
//             );

//             return;
//         }

//         navigate(
//             `/receptionist-dashboard/walk-in-invoice/${rentalId}`,
//             {
//                 state: {
//                     rental,
//                 },
//             }
//         );
//     };

//     // =====================================================
//     // RETURN
//     // =====================================================

//     const returnRental = (rental) => {
//         const rentalId =
//             getRentalId(rental);

//         if (!rentalId) {
//             console.error(
//                 "Rental ID missing:",
//                 rental
//             );

//             return;
//         }

//         console.log(
//             "Opening rental return page:",
//             rentalId
//         );

//         navigate(
//             `/receptionist-dashboard/rental/orders/${rentalId}/return`,
//             {
//                 state: {
//                     rental,
//                 },
//             }
//         );
//     };

//     // =====================================================
//     // RENDER
//     // =====================================================

//     return (
//         <div className="walkin-rental-orders-page">

//             {/* =========================================
//                 HEADER
//             ========================================== */}

//             <div className="rental-orders-header">

//                 <div>
//                     <h2>
//                         Walk-In Rental Orders
//                     </h2>

//                     <p>
//                         Manage all walk-in laptop
//                         rental customers
//                     </p>
//                 </div>

//                 <button
//                     className="new-rental-btn"
//                     onClick={
//                         createNewRental
//                     }
//                 >
//                     + New Walk-In Rental
//                 </button>

//             </div>

//             {/* =========================================
//                 ERROR
//             ========================================== */}

//             {error && (
//                 <div className="rental-error-box">
//                     {error}
//                 </div>
//             )}

//             {/* =========================================
//                 FILTERS
//             ========================================== */}

//             <div className="rental-filter-section">

//                 <input
//                     type="text"
//                     placeholder="Search customer / phone / rental number / laptop"
//                     value={search}
//                     onChange={(e) =>
//                         setSearch(
//                             e.target.value
//                         )
//                     }
//                 />

//                 <input
//                     type="date"
//                     value={selectedDate}
//                     onChange={(e) =>
//                         setSelectedDate(
//                             e.target.value
//                         )
//                     }
//                 />

//                 <select
//                     value={statusFilter}
//                     onChange={(e) =>
//                         setStatusFilter(
//                             e.target.value
//                         )
//                     }
//                 >
//                     <option value="ALL">
//                         All Status
//                     </option>

//                     <option value="ACTIVE">
//                         Active
//                     </option>

//                     <option value="PENDING">
//                         Pending
//                     </option>

//                     <option value="DOCUMENT_VERIFICATION">
//                         Document Verification
//                     </option>

//                     <option value="DEPOSIT_PENDING">
//                         Deposit Pending
//                     </option>

//                     <option value="RETURN_REQUESTED">
//                         Return Requested
//                     </option>

//                     <option value="SETTLEMENT_PENDING">
//                         Settlement Pending
//                     </option>

//                     <option value="RETURNED">
//                         Returned
//                     </option>

//                     <option value="COMPLETED">
//                         Completed
//                     </option>

//                     <option value="REJECTED">
//                         Rejected
//                     </option>

//                     <option value="CANCELLED">
//                         Cancelled
//                     </option>
//                 </select>

//                 <button
//                     className="refresh-btn"
//                     onClick={
//                         loadWalkInRentals
//                     }
//                     disabled={loading}
//                 >
//                     {loading
//                         ? "Loading..."
//                         : "Refresh"}
//                 </button>

//             </div>

//             {/* =========================================
//                 SUMMARY
//             ========================================== */}

//             <div className="rental-summary-box">

//                 {/* TOTAL RENTALS */}

//                 <div className="rental-summary-card">

//                     <h3>
//                         {
//                             filteredRentals.length
//                         }
//                     </h3>

//                     <p>
//                         Total Rentals
//                     </p>

//                 </div>

//                 {/* ACTIVE */}

//                 <div className="rental-summary-card">

//                     <h3>
//                         {activeRentals}
//                     </h3>

//                     <p>
//                         Active Rentals
//                     </p>

//                 </div>

//                 {/* RENT */}

//                 <div className="rental-summary-card">

//                     <h3>
//                         ₹{" "}
//                         {formatMoney(
//                             totalRent
//                         )}
//                     </h3>

//                     <p>
//                         Rental Amount + GST
//                     </p>

//                 </div>

//                 {/* EXPECTED DEPOSIT */}

//                 <div className="rental-summary-card">

//                     <h3>
//                         ₹{" "}
//                         {formatMoney(
//                             totalDeposit
//                         )}
//                     </h3>

//                     <p>
//                         Security Deposit
//                     </p>

//                 </div>

//                 {/* ACTUAL DEPOSIT PAID */}

//                 <div className="rental-summary-card">

//                     <h3>
//                         ₹{" "}
//                         {formatMoney(
//                             totalDepositPaid
//                         )}
//                     </h3>

//                     <p>
//                         Deposit Collected
//                     </p>

//                 </div>

//             </div>

//             {/* =========================================
//                 TABLE
//             ========================================== */}

//             <div className="rental-orders-table-wrapper">

//                 <table className="rental-orders-table">

//                     <thead>

//                         <tr>

//                             <th>
//                                 Rental ID
//                             </th>

//                             <th>
//                                 Date
//                             </th>

//                             <th>
//                                 Customer
//                             </th>

//                             <th>
//                                 Phone
//                             </th>

//                             <th>
//                                 Laptop
//                             </th>

//                             <th>
//                                 Duration
//                             </th>

//                             <th>
//                                 Monthly Rent
//                             </th>

//                             <th>
//                                 Deposit
//                             </th>

//                             <th>
//                                 Deposit Paid
//                             </th>

//                             <th>
//                                 Total
//                             </th>

//                             <th>
//                                 Status
//                             </th>

//                             <th>
//                                 Action
//                             </th>

//                         </tr>

//                     </thead>

//                     <tbody>

//                         {loading ? (

//                             <tr>

//                                 <td
//                                     colSpan="12"
//                                     className="table-message"
//                                 >
//                                     Loading Walk-In
//                                     Rentals...
//                                 </td>

//                             </tr>

//                         ) : filteredRentals.length === 0 ? (

//                             <tr>

//                                 <td
//                                     colSpan="12"
//                                     className="table-message"
//                                 >
//                                     No Walk-In Rental
//                                     Orders Found
//                                 </td>

//                             </tr>

//                         ) : (

//                             filteredRentals.map(
//                                 (rental) => {

//                                     const rentalId =
//                                         getRentalId(
//                                             rental
//                                         );

//                                     const status =
//                                         getStatus(
//                                             rental
//                                         );

//                                     const duration =
//                                         getRentalDuration(
//                                             rental
//                                         );

//                                     const deposit =
//                                         getSecurityDeposit(
//                                             rental
//                                         );

//                                     const depositPaid =
//                                         getDepositAmountPaid(
//                                             rental
//                                         );

//                                     const depositStatus =
//                                         getDepositPaymentStatus(
//                                             rental
//                                         );

//                                     return (
//                                         <tr
//                                             key={
//                                                 rentalId
//                                             }
//                                         >

//                                             {/* =================================
//                                                 RENTAL NUMBER
//                                             ================================== */}

//                                             <td>

//                                                 <strong>
//                                                     #
//                                                     {
//                                                         String(
//                                                             getRentalNumber(
//                                                                 rental
//                                                             )
//                                                         ).slice(
//                                                             -12
//                                                         )
//                                                     }
//                                                 </strong>

//                                             </td>

//                                             {/* =================================
//                                                 DATE
//                                             ================================== */}

//                                             <td>

//                                                 {rental?.createdAt
//                                                     ? new Date(
//                                                         rental.createdAt
//                                                     ).toLocaleDateString(
//                                                         "en-IN"
//                                                     )
//                                                     : "-"}

//                                             </td>

//                                             {/* =================================
//                                                 CUSTOMER
//                                             ================================== */}

//                                             <td>

//                                                 <div className="customer-cell">

//                                                     <strong>
//                                                         {
//                                                             getCustomerName(
//                                                                 rental
//                                                             )
//                                                         }
//                                                     </strong>

//                                                     <small>
//                                                         {
//                                                             rental?.customerType ||
//                                                             "INDIVIDUAL"
//                                                         }
//                                                     </small>

//                                                 </div>

//                                             </td>

//                                             {/* =================================
//                                                 PHONE
//                                             ================================== */}

//                                             <td>

//                                                 {
//                                                     getCustomerPhone(
//                                                         rental
//                                                     )
//                                                 }

//                                             </td>

//                                             {/* =================================
//                                                 PRODUCT
//                                             ================================== */}

//                                             <td>

//                                                 <div className="product-cell">

//                                                     <strong>
//                                                         {
//                                                             getProductName(
//                                                                 rental
//                                                             )
//                                                         }
//                                                     </strong>

//                                                     {getBrandName(
//                                                         rental
//                                                     ) && (

//                                                         <small>
//                                                             {
//                                                                 getBrandName(
//                                                                     rental
//                                                                 )
//                                                             }
//                                                         </small>

//                                                     )}

//                                                 </div>

//                                             </td>

//                                             {/* =================================
//                                                 DURATION
//                                             ================================== */}

//                                             <td>

//                                                 {duration.value}{" "}
//                                                 {
//                                                     duration.type
//                                                 }

//                                             </td>

//                                             {/* =================================
//                                                 MONTHLY RENT
//                                             ================================== */}

//                                             <td>

//                                                 ₹{" "}
//                                                 {formatMoney(
//                                                     getMonthlyRent(
//                                                         rental
//                                                     )
//                                                 )}

//                                             </td>

//                                             {/* =================================
//                                                 SECURITY DEPOSIT
//                                             ================================== */}

//                                             <td>

//                                                 ₹{" "}
//                                                 {formatMoney(
//                                                     deposit
//                                                 )}

//                                             </td>

//                                             {/* =================================
//                                                 DEPOSIT PAID
//                                             ================================== */}

//                                             <td>

//                                                 <div className="deposit-cell">

//                                                     <strong>
//                                                         ₹{" "}
//                                                         {
//                                                             formatMoney(
//                                                                 depositPaid
//                                                             )
//                                                         }
//                                                     </strong>

//                                                     <span
//                                                         className={
//                                                             `deposit-status ${getDepositStatusClass(
//                                                                 depositStatus
//                                                             )}`
//                                                         }
//                                                     >
//                                                         {
//                                                             depositStatus
//                                                         }
//                                                     </span>

//                                                 </div>

//                                             </td>

//                                             {/* =================================
//                                                 TOTAL
//                                             ================================== */}

//                                             <td>

//                                                 <strong>
//                                                     ₹{" "}
//                                                     {formatMoney(
//                                                         getTotalWithGST(
//                                                             rental
//                                                         )
//                                                     )}
//                                                 </strong>

//                                             </td>

//                                             {/* =================================
//                                                 STATUS
//                                             ================================== */}

//                                             <td>

//                                                 <span
//                                                     className={
//                                                         `rental-status ${getStatusClass(
//                                                             status
//                                                         )}`
//                                                     }
//                                                 >
//                                                     {
//                                                         status
//                                                     }
//                                                 </span>

//                                             </td>

//                                             {/* =================================
//                                                 ACTION
//                                             ================================== */}

//                                             <td>

//                                                 <div className="rental-action-buttons">

//                                                     {/* VIEW */}

//                                                     <button
//                                                         className="view-btn"
//                                                         onClick={() =>
//                                                             viewRental(
//                                                                 rental
//                                                             )
//                                                         }
//                                                     >
//                                                         View
//                                                     </button>

//                                                     {/* INVOICE */}

//                                                     <button
//                                                         className="print-btn"
//                                                         onClick={() =>
//                                                             printInvoice(
//                                                                 rental
//                                                             )
//                                                         }
//                                                     >
//                                                         Invoice
//                                                     </button>

//                                                     {/* RETURN */}

//                                                     {status ===
//                                                         "ACTIVE" && (

//                                                         <button
//                                                             className="return-btn"
//                                                             onClick={() =>
//                                                                 returnRental(
//                                                                     rental
//                                                                 )
//                                                             }
//                                                         >
//                                                             Return
//                                                         </button>

//                                                     )}

//                                                 </div>

//                                             </td>

//                                         </tr>
//                                     );
//                                 }
//                             )

//                         )}

//                     </tbody>

//                 </table>

//             </div>

//         </div>
//     );
// }

// export default WalkInRentalOrders;



import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WalkInRentalOrders.css";

import { getAllRentals } from "../../services/rentalApi";

function WalkInRentalOrders() {
  const navigate = useNavigate();

  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    loadWalkInRentals();
  }, []);

  const loadWalkInRentals = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllRentals();

      let list = [];
      if (Array.isArray(response)) {
        list = response;
      } else if (Array.isArray(response?.rentals)) {
        list = response.rentals;
      } else if (Array.isArray(response?.data)) {
        list = response.data;
      } else if (Array.isArray(response?.data?.rentals)) {
        list = response.data.rentals;
      } else if (Array.isArray(response?.data?.data)) {
        list = response.data.data;
      } else if (Array.isArray(response?.result)) {
        list = response.result;
      } else if (Array.isArray(response?.data?.result)) {
        list = response.data.result;
      }

      const walkInRentals = list.filter((rental) => {
        return (
          String(rental?.rentalSource || "")
            .trim()
            .toUpperCase() === "WALK_IN"
        );
      });

      setRentals(walkInRentals);
    } catch (err) {
      console.error("WALK-IN RENTALS ERROR:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load walk-in rental orders"
      );
      setRentals([]);
    } finally {
      setLoading(false);
    }
  };

  const getCustomerName = (rental) => {
    if (String(rental?.customerType || "").toUpperCase() === "COMPANY") {
      return (
        rental?.companyDetails?.contactPerson ||
        rental?.companyDetails?.companyName ||
        "Company Customer"
      );
    }
    return (
      rental?.individualDetails?.fullName ||
      rental?.customer?.name ||
      rental?.customer?.fullName ||
      "Walk-In Customer"
    );
  };

  const getCustomerPhone = (rental) => {
    if (String(rental?.customerType || "").toUpperCase() === "COMPANY") {
      return rental?.companyDetails?.phone || "—";
    }
    return (
      rental?.individualDetails?.phone ||
      rental?.customer?.phone ||
      "—"
    );
  };

  const getProductName = (rental) => {
    return (
      rental?.product?.name ||
      rental?.product?.title ||
      rental?.rentalProduct?.product?.name ||
      rental?.rentalProduct?.product?.title ||
      rental?.rentalProduct?.name ||
      "Rental Laptop"
    );
  };

  const getBrandName = (rental) => {
    const brand =
      rental?.product?.brand || rental?.rentalProduct?.product?.brand;
    if (typeof brand === "object" && brand !== null) {
      return brand?.name || brand?.title || "";
    }
    return brand || "";
  };

  const getRentalId = (rental) => {
    return rental?._id || rental?.id || rental?.rentalId || "";
  };

  const getRentalNumber = (rental) => {
    return (
      rental?.rentalNumber ||
      rental?.rentalNo ||
      rental?.rental_number ||
      getRentalId(rental)
    );
  };

  const getMonthlyRent = (rental) => {
    return Number(
      rental?.monthlyRent ?? rental?.rentalProduct?.monthlyRent ?? 0
    );
  };

  const getRentalDurationType = (rental) => {
    return String(rental?.rentalDurationType || "MONTHS").toUpperCase();
  };

  const getRentalDuration = (rental) => {
    const type = getRentalDurationType(rental);
    const duration = Number(
      rental?.rentalDuration ?? rental?.rentalMonths ?? 1
    );
    return {
      value: duration,
      type: type === "DAYS" ? "Days" : "Months",
    };
  };

  const getSecurityDeposit = (rental) => {
    return Number(rental?.securityDeposit ?? 0);
  };

  const getDepositAmountPaid = (rental) => {
    const possiblePaidAmounts = [
      rental?.depositAmountPaid,
      rental?.depositPaid,
      rental?.securityDepositPaid,
      rental?.paidDeposit,
      rental?.deposit?.paidAmount,
      rental?.deposit?.amountPaid,
      rental?.payment?.depositAmount,
      rental?.payment?.amount,
    ];

    for (const amount of possiblePaidAmounts) {
      if (
        amount !== undefined &&
        amount !== null &&
        amount !== "" &&
        !Number.isNaN(Number(amount))
      ) {
        return Number(amount);
      }
    }
    return 0;
  };

  const getDepositPaymentStatus = (rental) => {
    const expected = getSecurityDeposit(rental);
    const paid = getDepositAmountPaid(rental);
    const backendStatus = String(
      rental?.depositPaymentStatus ||
        rental?.depositStatus ||
        rental?.securityDepositStatus ||
        ""
    )
      .trim()
      .toUpperCase();

    if (backendStatus === "PAID") return "PAID";
    if (backendStatus === "PARTIAL") return "PARTIAL";
    if (expected <= 0) return paid > 0 ? "PAID" : "UNPAID";
    if (paid >= expected) return "PAID";
    if (paid > 0) return "PARTIAL";
    return "UNPAID";
  };

  const getGSTPercentage = (rental) => {
    return Number(rental?.gstPercentage ?? rental?.gst ?? 0);
  };

  const getTotalRent = (rental) => {
    const monthlyRent = getMonthlyRent(rental);
    const type = getRentalDurationType(rental);
    const duration = Number(
      rental?.rentalDuration ?? rental?.rentalMonths ?? 1
    );

    if (type === "DAYS") {
      return (monthlyRent / 30) * duration;
    }
    return monthlyRent * duration;
  };

  const getGSTAmount = (rental) => {
    return (getTotalRent(rental) * getGSTPercentage(rental)) / 100;
  };

  const getTotalWithGST = (rental) => {
    return getTotalRent(rental) + getGSTAmount(rental);
  };

  const getStatus = (rental) => {
    return String(rental?.status || "PENDING").toUpperCase();
  };

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });
  };

  const filteredRentals = useMemo(() => {
    let result = [...rentals];

    if (search.trim()) {
      const keyword = search.trim().toLowerCase();
      result = result.filter((rental) => {
        const rentalId = String(getRentalId(rental)).toLowerCase();
        const rentalNumber = String(getRentalNumber(rental)).toLowerCase();
        const customer = getCustomerName(rental).toLowerCase();
        const phone = getCustomerPhone(rental).toLowerCase();
        const product = getProductName(rental).toLowerCase();

        return (
          rentalId.includes(keyword) ||
          rentalNumber.includes(keyword) ||
          customer.includes(keyword) ||
          phone.includes(keyword) ||
          product.includes(keyword)
        );
      });
    }

    if (selectedDate) {
      result = result.filter((rental) => {
        if (!rental?.createdAt) return false;
        const rentalDate = new Date(rental.createdAt)
          .toISOString()
          .split("T")[0];
        return rentalDate === selectedDate;
      });
    }

    if (statusFilter !== "ALL") {
      result = result.filter((rental) => getStatus(rental) === statusFilter);
    }

    return result;
  }, [rentals, search, selectedDate, statusFilter]);

  // Aggregate stats
  const totalRentWithGST = filteredRentals.reduce(
    (sum, rental) => sum + getTotalWithGST(rental),
    0
  );
  const totalDeposit = filteredRentals.reduce(
    (sum, rental) => sum + getSecurityDeposit(rental),
    0
  );
  const totalDepositPaid = filteredRentals.reduce(
    (sum, rental) => sum + getDepositAmountPaid(rental),
    0
  );
  const activeRentalsCount = filteredRentals.filter(
    (rental) => getStatus(rental) === "ACTIVE"
  ).length;

  const viewRental = (rental) => {
    const rentalId = getRentalId(rental);
    if (!rentalId) return;
    navigate(`/receptionist-dashboard/rental/orders/${rentalId}`, {
      state: { rental },
    });
  };

  const createNewRental = () => {
    navigate("/receptionist-dashboard/rental/new");
  };

  const printInvoice = (rental) => {
    const rentalId = getRentalId(rental);
    if (!rentalId) {
      alert("Rental ID not found");
      return;
    }
    navigate(`/receptionist-dashboard/walk-in-invoice/${rentalId}`, {
      state: { rental },
    });
  };

  const returnRental = (rental) => {
    const rentalId = getRentalId(rental);
    if (!rentalId) return;
    navigate(`/receptionist-dashboard/rental/orders/${rentalId}/return`, {
      state: { rental },
    });
  };

  return (
    <div className="walkin-rental-container">
      {/* Top Header */}
      <header className="walkin-header">
        <div className="header-meta">
          <div className="badge-tag">RECEPTION DESK</div>
          <h1 className="header-title">Walk-In Rental Orders</h1>
          <p className="header-subtitle">
            Overview and checkout lifecycle for in-store equipment rentals
          </p>
        </div>
        <button className="primary-action-btn" onClick={createNewRental}>
          <span className="btn-icon">+</span>
          <span>New Walk-In Order</span>
        </button>
      </header>

      {/* Error Notice */}
      {error && <div className="error-banner">{error}</div>}

      {/* Analytics KPI Ribbon */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Orders</span>
          <div className="stat-val">{filteredRentals.length}</div>
          <span className="stat-sub">Total filtered</span>
        </div>
        <div className="stat-card accent">
          <span className="stat-label">Active Leases</span>
          <div className="stat-val">{activeRentalsCount}</div>
          <span className="stat-sub">Currently deployed</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Revenue (Inc. GST)</span>
          <div className="stat-val">₹{formatMoney(totalRentWithGST)}</div>
          <span className="stat-sub">Net rental billing</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Sec. Deposit Target</span>
          <div className="stat-val">₹{formatMoney(totalDeposit)}</div>
          <span className="stat-sub">Agreed security value</span>
        </div>
        <div className="stat-card highlight">
          <span className="stat-label">Deposits Collected</span>
          <div className="stat-val">₹{formatMoney(totalDepositPaid)}</div>
          <span className="stat-sub">Realized in account</span>
        </div>
      </div>

      {/* Control Panel / Filters */}
      <div className="controls-bar">
        <div className="search-input-wrap">
          <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            className="clean-input"
            placeholder="Search by customer, phone, serial or laptop..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filters-group">
          <input
            type="date"
            className="clean-input date-input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          <select
            className="clean-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING">Pending</option>
            <option value="DOCUMENT_VERIFICATION">Doc Verification</option>
            <option value="DEPOSIT_PENDING">Deposit Pending</option>
            <option value="RETURN_REQUESTED">Return Requested</option>
            <option value="SETTLEMENT_PENDING">Settlement Pending</option>
            <option value="RETURNED">Returned</option>
            <option value="COMPLETED">Completed</option>
            <option value="REJECTED">Rejected</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <button
            className="refresh-ghost-btn"
            onClick={loadWalkInRentals}
            disabled={loading}
          >
            {loading ? "Syncing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Main Grid View */}
      {loading ? (
        <div className="state-placeholder">
          <div className="shimmer-spinner"></div>
          <p>Retrieving walk-in lease database...</p>
        </div>
      ) : filteredRentals.length === 0 ? (
        <div className="state-placeholder">
          <p className="no-data-text">No walk-in rental orders match the current criteria.</p>
        </div>
      ) : (
        <div className="rental-cards-grid">
          {filteredRentals.map((rental) => {
            const rentalId = getRentalId(rental);
            const status = getStatus(rental);
            const duration = getRentalDuration(rental);
            const deposit = getSecurityDeposit(rental);
            const depositPaid = getDepositAmountPaid(rental);
            const depositStatus = getDepositPaymentStatus(rental);
            const brand = getBrandName(rental);

            return (
              <div key={rentalId} className="medium-order-card">
                {/* Card Header */}
                <div className="card-top-row">
                  <div className="order-id-group">
                    <span className="order-code">
                      #{String(getRentalNumber(rental)).slice(-8).toUpperCase()}
                    </span>
                    <span className="order-date">
                      {rental?.createdAt
                        ? new Date(rental.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </span>
                  </div>
                  <span className={`status-pill status-${status.toLowerCase()}`}>
                    {status.replace(/_/g, " ")}
                  </span>
                </div>

                {/* Device & Hardware Info */}
                <div className="card-product-box">
                  <div className="product-title-row">
                    <h3 className="product-heading">{getProductName(rental)}</h3>
                    {brand && <span className="brand-chip">{brand}</span>}
                  </div>
                  <div className="specs-row">
                    <span>
                      Duration: <strong>{duration.value} {duration.type}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Rent: <strong>₹{formatMoney(getMonthlyRent(rental))}/mo</strong>
                    </span>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="card-customer-row">
                  <div className="avatar-circle">
                    {getCustomerName(rental).charAt(0).toUpperCase()}
                  </div>
                  <div className="customer-details">
                    <span className="customer-name">{getCustomerName(rental)}</span>
                    <span className="customer-contact">
                      {getCustomerPhone(rental)} • {rental?.customerType || "INDIVIDUAL"}
                    </span>
                  </div>
                </div>

                {/* Financial Ledger Section */}
                <div className="card-financials-panel">
                  <div className="fin-item">
                    <span className="fin-label">Total Lease (inc. GST)</span>
                    <span className="fin-val highlight">
                      ₹{formatMoney(getTotalWithGST(rental))}
                    </span>
                  </div>
                  <div className="fin-divider"></div>
                  <div className="fin-item">
                    <div className="deposit-tag-header">
                      <span className="fin-label">Sec. Deposit</span>
                      <span className={`deposit-micro-badge ${depositStatus.toLowerCase()}`}>
                        {depositStatus}
                      </span>
                    </div>
                    <span className="fin-val">
                      ₹{formatMoney(depositPaid)}{" "}
                      <small className="deposit-expected">/ ₹{formatMoney(deposit)}</small>
                    </span>
                  </div>
                </div>

                {/* Card Action Controls */}
                <div className="card-footer-actions">
                  <button
                    className="action-btn view-outline-btn"
                    onClick={() => viewRental(rental)}
                  >
                    View
                  </button>
                  <button
                    className="action-btn invoice-outline-btn"
                    onClick={() => printInvoice(rental)}
                  >
                    Invoice
                  </button>
                  {status === "ACTIVE" && (
                    <button
                      className="action-btn return-solid-btn"
                      onClick={() => returnRental(rental)}
                    >
                      Return
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default WalkInRentalOrders;