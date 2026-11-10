// import { useEffect, useState } from "react";
// import "./WalkInOrders.css";
// import {
//     getAllOrders
// } from "../../../services/orderService";

// function WalkInOrders() {

//     const [orders, setOrders] = useState([]);

//     const [filteredOrders, setFilteredOrders] = useState([]);

//     const [search, setSearch] = useState("");

//     const [loading, setLoading] = useState(true);

//     useEffect(() => {

//         loadOrders();

//     }, []);

//     const loadOrders = async () => {

//         try {

//             setLoading(true);

//             const res = await getAllOrders();

//             console.log("ALL ORDERS :", res);

//             const list =
//                 res.orders ||
//                 res.data ||
//                 [];

//             // Only Walk-In Orders

//             const walkInOrders = list.filter(

//                 (order) =>

//                     order.orderSource === "WALK_IN"

//             );

//             setOrders(walkInOrders);

//             setFilteredOrders(walkInOrders);

//         }

//         catch (error) {

//             console.log(error);

//         }

//         finally {

//             setLoading(false);

//         }

//     };

//     // ======================================
//     // SEARCH
//     // ======================================

//     const handleSearch = (value) => {

//         setSearch(value);

//         if (!value) {

//             setFilteredOrders(orders);

//             return;

//         }

//         const keyword = value.toLowerCase();

//         const result = orders.filter(

//             (order) =>

//                 order._id.toLowerCase().includes(keyword)

//                 ||

//                 order.shippingAddress?.fullName

//                     ?.toLowerCase()

//                     .includes(keyword)

//                 ||

//                 order.shippingAddress?.phone

//                     ?.includes(keyword)

//         );

//         setFilteredOrders(result);

//     };

//         // ======================================
//     // DATE FILTER
//     // ======================================

//     const [selectedDate, setSelectedDate] = useState("");

//     useEffect(() => {

//         if (!selectedDate) {

//             setFilteredOrders(orders);

//             return;

//         }

//         const result = orders.filter((order) => {

//             const orderDate = new Date(order.createdAt)
//                 .toISOString()
//                 .split("T")[0];

//             return orderDate === selectedDate;

//         });

//         setFilteredOrders(result);

//     }, [selectedDate, orders]);

//     // ======================================
//     // TOTAL SALES
//     // ======================================

//     const totalSales = filteredOrders.reduce(

//         (sum, order) =>

//             sum + Number(order.totalAmount || 0),

//         0

//     );

//     // ======================================
//     // TOTAL ORDERS
//     // ======================================

//     const totalOrders = filteredOrders.length;

//     // ======================================
//     // VIEW ORDER
//     // ======================================

//     const viewOrder = (order) => {

//         console.log(order);

//         // Next Part me Invoice Modal open hoga

//     };

//     // ======================================
//     // PRINT INVOICE
//     // ======================================

//     const printInvoice = (order) => {

//         window.open(

//             `/walkin-invoice/${order._id}`,

//             "_blank"

//         );

//     };

//     // ======================================
//     // RETURN JSX
//     // ======================================

//     return (

//         <div className="walkin-orders-page">

//             <div className="page-header">

//                 <h2>

//                     Walk-In Orders

//                 </h2>

//             </div>

//             <div className="filter-section">

//                 <input

//                     type="text"

//                     placeholder="Search Customer / Phone / Order ID"

//                     value={search}

//                     onChange={(e)=>

//                         handleSearch(e.target.value)

//                     }

//                 />

//                 <input

//                     type="date"

//                     value={selectedDate}

//                     onChange={(e)=>

//                         setSelectedDate(e.target.value)

//                     }

//                 />

//             </div>

//             <div className="summary-box">

//                 <div className="summary-card">

//                     <h3>

//                         {totalOrders}

//                     </h3>

//                     <p>

//                         Total Orders

//                     </p>

//                 </div>

//                 <div className="summary-card">

//                     <h3>

//                         ₹ {totalSales}

//                     </h3>

//                     <p>

//                         Total Sales

//                     </p>

//                 </div>

//             </div>

//                         <div className="orders-table">

//                 <table>

//                     <thead>

//                         <tr>

//                             <th>Order ID</th>

//                             <th>Date</th>

//                             <th>Customer</th>

//                             <th>Phone</th>

//                             <th>Products</th>

//                             <th>Qty</th>

//                             <th>Total</th>

//                             <th>Payment</th>

//                             <th>Status</th>

//                             <th>Action</th>

//                         </tr>

//                     </thead>

//                     <tbody>

//                         {

//                             loading ?

//                             (

//                                 <tr>

//                                     <td colSpan="10">

//                                         Loading...

//                                     </td>

//                                 </tr>

//                             )

//                             :

//                             filteredOrders.length===0 ?

//                             (

//                                 <tr>

//                                     <td colSpan="10">

//                                         No Walk-In Orders Found

//                                     </td>

//                                 </tr>

//                             )

//                             :

//                             filteredOrders.map((order)=>(

//                                 <tr key={order._id}>

//                                     <td>

//                                         {order._id.slice(-8)}

//                                     </td>

//                                     <td>

//                                         {

//                                             new Date(

//                                                 order.createdAt

//                                             ).toLocaleDateString()

//                                         }

//                                     </td>

//                                     <td>

//                                         {

//                                             order.shippingAddress

//                                                 ?.fullName

//                                         }

//                                     </td>

//                                     <td>

//                                         {

//                                             order.shippingAddress

//                                                 ?.phone

//                                         }

//                                     </td>

//                                     <td>

//                                         {

//                                             order.orderItems.length

//                                         }

//                                     </td>

//                                     <td>

//                                         {

//                                             order.orderItems.reduce(

//                                                 (sum,item)=>

//                                                 sum+

//                                                 item.quantity,

//                                                 0

//                                             )

//                                         }

//                                     </td>

//                                     <td>

//                                         ₹

//                                         {

//                                             order.totalAmount

//                                         }

//                                     </td>

//                                     <td>

//                                         <span
//                                             className={
//                                                 order.paymentStatus==="PAID"
//                                                 ?
//                                                 "paid"
//                                                 :
//                                                 "pending"
//                                             }
//                                         >

//                                             {

//                                                 order.paymentStatus

//                                             }

//                                         </span>

//                                     </td>

//                                     <td>

//                                         <span
//                                             className="order-status"
//                                         >

//                                             {

//                                                 order.orderStatus

//                                             }

//                                         </span>

//                                     </td>

//                                     <td>

//                                         <div
//                                             className="action-buttons"
//                                         >

//                                             <button

//                                                 className="view-btn"

//                                                 onClick={()=>

//                                                     viewOrder(order)

//                                                 }

//                                             >

//                                                 View

//                                             </button>

//                                             <button

//                                                 className="print-btn"

//                                                 onClick={()=>

//                                                     printInvoice(order)

//                                                 }

//                                             >

//                                                 Print

//                                             </button>

//                                         </div>

//                                     </td>

//                                 </tr>

//                             ))

//                         }

//                     </tbody>

//                 </table>

//             </div>

//         </div>

//     );

// }

// export default WalkInOrders;



import { useEffect, useMemo, useState } from "react";
import "./WalkInOrders.css";
import { getAllOrders } from "../../../services/orderService";

function WalkInOrders() {
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);

            const res = await getAllOrders();

            const list = Array.isArray(res?.orders)
                ? res.orders
                : Array.isArray(res?.data)
                    ? res.data
                    : Array.isArray(res?.data?.orders)
                        ? res.data.orders
                        : [];

            const walkInOrders = list.filter(
                (order) => order.orderSource === "WALK_IN"
            );

            setOrders(walkInOrders);
        } catch (error) {
            console.error("Failed to load walk-in orders:", error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    // Apply search and date filters together.
    const filteredOrders = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return orders.filter((order) => {
            const orderId = String(order?._id || "").toLowerCase();
            const customerName = String(
                order?.shippingAddress?.fullName || ""
            ).toLowerCase();
            const phone = String(
                order?.shippingAddress?.phone || ""
            ).toLowerCase();
            const orderNumber = String(
                order?.orderNumber || ""
            ).toLowerCase();

            const matchesSearch =
                !keyword ||
                orderId.includes(keyword) ||
                customerName.includes(keyword) ||
                phone.includes(keyword) ||
                orderNumber.includes(keyword);

            const orderDate = order?.createdAt
                ? new Date(order.createdAt)
                : null;

            const formattedDate =
                orderDate && !Number.isNaN(orderDate.getTime())
                    ? [
                        orderDate.getFullYear(),
                        String(orderDate.getMonth() + 1).padStart(2, "0"),
                        String(orderDate.getDate()).padStart(2, "0"),
                    ].join("-")
                    : "";

            const matchesDate =
                !selectedDate || formattedDate === selectedDate;

            return matchesSearch && matchesDate;
        });
    }, [orders, search, selectedDate]);

    const totalSales = filteredOrders.reduce(
        (sum, order) => sum + Number(order?.totalAmount || 0),
        0
    );

    const totalOrders = filteredOrders.length;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        }).format(Number(amount || 0));
    };

    const formatDate = (date) => {
        if (!date) return "—";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) return "—";

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getPaymentClass = (status) => {
        return String(status || "").toUpperCase() === "PAID"
            ? "paid"
            : "pending";
    };

    const viewOrder = (order) => {
        console.log("Selected walk-in order:", order);
        // Open invoice/details modal here when implemented.
    };

    const printInvoice = (order) => {
        if (!order?._id) return;

        window.open(
            `/walkin-invoice/${order._id}`,
            "_blank",
            "noopener,noreferrer"
        );
    };

    const clearFilters = () => {
        setSearch("");
        setSelectedDate("");
    };

    return (
        <div className="walkin-orders-page">
            {/* Page heading */}
            <div className="page-header">
                <div>
                    <span className="page-eyebrow">POS COUNTER</span>
                    <h2>Walk-In Orders</h2>
                    <p>View and manage orders created at the reception desk.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="filter-section">
                <div className="filter-control search-control">
                    <label htmlFor="walkin-search">Search orders</label>
                    <div className="filter-input-wrap">
                        <span className="filter-icon" aria-hidden="true">
                            ⌕
                        </span>
                        <input
                            id="walkin-search"
                            type="search"
                            placeholder="Customer name, phone or order ID"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="filter-control date-control">
                    <label htmlFor="walkin-date">Order date</label>
                    <input
                        id="walkin-date"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>

                {(search || selectedDate) && (
                    <button
                        type="button"
                        className="clear-filter-btn"
                        onClick={clearFilters}
                    >
                        Clear filters
                    </button>
                )}
            </div>

            {/* Summary cards */}
            <div className="summary-box">
                <div className="summary-card">
                    <div className="summary-card-icon orders-icon">
                        <span aria-hidden="true">▤</span>
                    </div>
                    <div className="summary-card-content">
                        <p>Total Orders</p>
                        <h3>{loading ? "—" : totalOrders}</h3>
                        <span>Matching walk-in orders</span>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-card-icon sales-icon">
                        <span aria-hidden="true">₹</span>
                    </div>
                    <div className="summary-card-content">
                        <p>Total Sales</p>
                        <h3>{loading ? "—" : formatCurrency(totalSales)}</h3>
                        <span>Sales from filtered orders</span>
                    </div>
                </div>
            </div>

            {/* Orders table */}
            <div className="orders-section">
                <div className="orders-section-header">
                    <div>
                        <h3>Order List</h3>
                        <p>Recent walk-in transactions</p>
                    </div>

                    <span className="orders-count">
                        {loading ? "Loading..." : `${totalOrders} Orders`}
                    </span>
                </div>

                <div className="orders-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Customer</th>
                                <th>Phone</th>
                                <th>Products</th>
                                <th>Qty</th>
                                <th>Total</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="10">
                                        <div className="loading-text">
                                            <span className="loading-spinner" />
                                            Loading walk-in orders...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="10">
                                        <div className="no-orders">
                                            <span className="empty-icon">▤</span>
                                            <strong>No walk-in orders found</strong>
                                            <p>
                                                {search || selectedDate
                                                    ? "Try changing your search or date filter."
                                                    : "Walk-in orders will appear here once created."}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => {
                                    const items = Array.isArray(order.orderItems)
                                        ? order.orderItems
                                        : [];

                                    const quantity = items.reduce(
                                        (sum, item) =>
                                            sum + Number(item?.quantity || 0),
                                        0
                                    );

                                    return (
                                        <tr key={order._id}>
                                            <td>
                                                <span className="order-id">
                                                    #{String(order._id || "").slice(-8)}
                                                </span>
                                            </td>

                                            <td>{formatDate(order.createdAt)}</td>

                                            <td>
                                                <span className="customer-name">
                                                    {order.shippingAddress?.fullName || "Walk-in Customer"}
                                                </span>
                                            </td>

                                            <td>
                                                {order.shippingAddress?.phone || "—"}
                                            </td>

                                            <td>{items.length}</td>

                                            <td>{quantity}</td>

                                            <td>
                                                <strong className="order-total">
                                                    {formatCurrency(order.totalAmount)}
                                                </strong>
                                            </td>

                                            <td>
                                                <span
                                                    className={`payment-badge ${getPaymentClass(
                                                        order.paymentStatus
                                                    )}`}
                                                >
                                                    {order.paymentStatus || "PENDING"}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="order-status">
                                                    {String(
                                                        order.orderStatus || "PROCESSING"
                                                    ).replaceAll("_", " ")}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        type="button"
                                                        className="view-btn"
                                                        onClick={() => viewOrder(order)}
                                                    >
                                                        View
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="print-btn"
                                                        onClick={() => printInvoice(order)}
                                                    >
                                                        Print
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default WalkInOrders;
