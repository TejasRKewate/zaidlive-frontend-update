// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./NewWalkInOrder.css";
// import { toast } from "react-toastify";

// import {
//     getProducts,
//     createWalkInOrder,
// } from "../../../../services/walkInOrderService";

// import WalkInInvoice from "../WalkInInvoice/WalkInInvoice";

// import {
//     createInvoice,
// } from "../../../../services/invoiceService";

// function NewWalkInOrder() {

//     const navigate = useNavigate();

//     const [products, setProducts] = useState([]);
//     const [filteredProducts, setFilteredProducts] = useState([]);

//     const [cart, setCart] = useState([]);
//     const [search, setSearch] = useState("");

//     const [loading, setLoading] = useState(true);
//     const [placingOrder, setPlacingOrder] = useState(false);

//     const [customer, setCustomer] = useState({
//         fullName: "",
//         phone: "",
//         addressLine: "",
//         city: "",
//         state: "",
//         pincode: "",
//         country: "India",
//         landmark: "",
//     });

//     const [paymentMethod, setPaymentMethod] = useState("CASH");
//     const [invoiceData, setInvoiceData] = useState(null);

//     // =====================================================
//     // PRODUCT TYPE CHECK
//     // =====================================================

//     const isWalkInProduct = (product) => {

//         if (!product) {
//             return false;
//         }

//         const productType = String(
//             product.productType ??
//             product.type ??
//             product.product_type ??
//             product.productCategoryType ??
//             product.itemType ??
//             ""
//         )
//             .trim()
//             .toUpperCase();

//         // NEW
//         if (
//             productType === "NEW" ||
//             productType === "NEW_PRODUCT"
//         ) {
//             return true;
//         }

//         // REFURBISHED
//         if (
//             productType === "REFURBISHED" ||
//             productType === "REFURBISH" ||
//             productType === "REFURB" ||
//             productType === "REFURBISHED_PRODUCT"
//         ) {
//             return true;
//         }

//         // RENTAL + everything else hidden
//         return false;
//     };

//     // =====================================================
//     // GET PRODUCT PRICE
//     // =====================================================
//     // Different product API responses may have price in
//     // different fields.
//     //
//     // We check all common fields so product amount does
//     // not become 0 unnecessarily.
//     // =====================================================

//     const getProductPrice = (product) => {

//         if (!product) {
//             return 0;
//         }

//         const possiblePrices = [

//             // ---------------------------------------------
//             // MAIN PRICING OBJECT
//             // ---------------------------------------------

//             product.pricing?.sellingPrice,

//             product.pricing?.finalPrice,

//             product.pricing?.retailPrice,

//             product.pricing?.salePrice,

//             product.pricing?.price,

//             product.pricing?.amount,

//             product.pricing?.selling_price,

//             product.pricing?.final_price,

//             product.pricing?.retail_price,

//             product.pricing?.sale_price,

//             // ---------------------------------------------
//             // DIRECT PRODUCT FIELDS
//             // ---------------------------------------------

//             product.sellingPrice,

//             product.finalPrice,

//             product.retailPrice,

//             product.salePrice,

//             product.price,

//             product.amount,

//             product.selling_price,

//             product.final_price,

//             product.retail_price,

//             product.sale_price,

//             // ---------------------------------------------
//             // OTHER POSSIBLE NESTED FIELDS
//             // ---------------------------------------------

//             product.product?.pricing?.sellingPrice,

//             product.product?.pricing?.finalPrice,

//             product.product?.pricing?.retailPrice,

//             product.product?.sellingPrice,

//             product.product?.finalPrice,

//             product.product?.retailPrice,

//             product.product?.price,

//         ];

//         for (const value of possiblePrices) {

//             if (
//                 value !== undefined &&
//                 value !== null &&
//                 value !== "" &&
//                 !Number.isNaN(Number(value))
//             ) {

//                 const numericValue = Number(value);

//                 if (numericValue >= 0) {
//                     return numericValue;
//                 }
//             }
//         }

//         return 0;
//     };

//     // =====================================================
//     // LOAD PRODUCTS
//     // =====================================================

//     useEffect(() => {
//         loadProducts();
//     }, []);

//     const loadProducts = async () => {

//         try {

//             setLoading(true);

//             console.log(
//                 "Loading products for Walk-In..."
//             );

//             const data = await getProducts();

//             console.log(
//                 "WALK-IN ALL PRODUCTS:",
//                 data
//             );

//             // =================================================
//             // GET PRODUCT ARRAY
//             // =================================================

//             const allProducts = Array.isArray(data)
//                 ? data
//                 : data?.products ||
//                   data?.data ||
//                   [];

//             // =================================================
//             // ONLY NEW + REFURBISHED
//             // =================================================

//             const walkInProducts = allProducts.filter(
//                 (product) => {

//                     const type = String(
//                         product?.productType ??
//                         product?.type ??
//                         product?.product_type ??
//                         product?.productCategoryType ??
//                         product?.itemType ??
//                         ""
//                     )
//                         .trim()
//                         .toUpperCase();

//                     console.log(
//                         "WALK-IN PRODUCT TYPE:",
//                         product?.name,
//                         type
//                     );

//                     // IMPORTANT:
//                     // Log actual price structure also
//                     console.log(
//                         "WALK-IN PRODUCT PRICE DATA:",
//                         {
//                             name: product?.name,
//                             pricing: product?.pricing,
//                             sellingPrice: product?.sellingPrice,
//                             finalPrice: product?.finalPrice,
//                             retailPrice: product?.retailPrice,
//                             price: product?.price,
//                             calculatedPrice:
//                                 getProductPrice(product),
//                         }
//                     );

//                     return isWalkInProduct(product);
//                 }
//             );

//             console.log(
//                 "WALK-IN ALLOWED PRODUCTS:",
//                 walkInProducts
//             );

//             setProducts(
//                 walkInProducts
//             );

//             setFilteredProducts(
//                 walkInProducts
//             );

//         } catch (err) {

//             console.error(
//                 "PRODUCT LOAD ERROR:",
//                 err
//             );

//             setProducts([]);
//             setFilteredProducts([]);

//             toast.error(
//                 err?.response?.data?.message ||
//                 "Unable to load products"
//             );

//         } finally {

//             setLoading(false);

//         }
//     };

//     // =====================================================
//     // GET STOCK
//     // =====================================================

//     const getStock = (product) => {

//         return Number(
//             product.inventory?.currentStock ??
//             product.currentStock ??
//             product.availableStock ??
//             product.stock ??
//             0
//         );
//     };

//     // =====================================================
//     // SEARCH PRODUCT
//     // =====================================================

//     useEffect(() => {

//         const value = search
//             .trim()
//             .toLowerCase();

//         if (!value) {

//             setFilteredProducts(
//                 products
//             );

//             return;
//         }

//         const result = products.filter(
//             (product) => {

//                 const name = String(
//                     product.name || ""
//                 ).toLowerCase();

//                 const sku = String(
//                     product.sku || ""
//                 ).toLowerCase();

//                 return (
//                     name.includes(value) ||
//                     sku.includes(value)
//                 );
//             }
//         );

//         setFilteredProducts(result);

//     }, [
//         search,
//         products
//     ]);

//     // =====================================================
//     // ADD PRODUCT
//     // =====================================================

//     const addProduct = (product) => {

//         // =================================================
//         // SAFETY CHECK
//         // =================================================

//         if (!isWalkInProduct(product)) {

//             toast.error(
//                 "Rental products cannot be added to Walk-In Order."
//             );

//             return;
//         }

//         // =================================================
//         // STOCK
//         // =================================================

//         const currentStock = Number(
//             product.inventory?.currentStock ??
//             product.currentStock ??
//             product.availableStock ??
//             product.stock ??
//             0
//         );

//         const reservedStock = Number(
//             product.inventory?.reservedStock ??
//             product.reservedStock ??
//             0
//         );

//         const availableStock = Math.max(
//             currentStock - reservedStock,
//             0
//         );

//         // =================================================
//         // OUT OF STOCK
//         // =================================================

//         if (availableStock <= 0) {

//             toast.error(
//                 "This product is out of stock."
//             );

//             return;
//         }

//         // =================================================
//         // GET PRICE
//         // =================================================

//         const sellingPrice =
//             getProductPrice(product);

//         console.log(
//             "ADDING WALK-IN PRODUCT:",
//             {
//                 productId: product._id,
//                 name: product.name,
//                 price: sellingPrice,
//                 originalProduct: product,
//             }
//         );

//         // =================================================
//         // CHECK CART
//         // =================================================

//         const existingItem = cart.find(
//             (item) =>
//                 item.product === product._id
//         );

//         // =================================================
//         // PRODUCT ALREADY IN CART
//         // =================================================

//         if (existingItem) {

//             if (
//                 existingItem.quantity >=
//                 availableStock
//             ) {

//                 toast.error(
//                     `Only ${availableStock} item(s) available.`
//                 );

//                 return;
//             }

//             setCart(
//                 cart.map(
//                     (item) =>
//                         item.product === product._id
//                             ? {
//                                 ...item,
//                                 quantity:
//                                     item.quantity + 1,
//                             }
//                             : item
//                 )
//             );

//             return;
//         }

//         // =================================================
//         // ADD NEW PRODUCT
//         // =================================================

//         setCart([
//             ...cart,

//             {
//                 product: product._id,

//                 title: product.name,

//                 sku: product.sku,

//                 quantity: 1,

//                 originalPrice:
//                     sellingPrice,

//                 price:
//                     sellingPrice,

//                 discountAmount: 0,

//                 imageUrl:
//                     product.images?.[0]?.url || "",

//                 availableStock:
//                     availableStock,
//             },
//         ]);
//     };

//     // =====================================================
//     // INCREASE QUANTITY
//     // =====================================================

//     const increaseQty = (id) => {

//         const cartItem = cart.find(
//             (item) =>
//                 item.product === id
//         );

//         if (!cartItem) {
//             return;
//         }

//         if (
//             cartItem.quantity >=
//             cartItem.availableStock
//         ) {

//             toast.error(
//                 `Only ${cartItem.availableStock} item(s) available.`
//             );

//             return;
//         }

//         setCart(
//             cart.map(
//                 (item) =>
//                     item.product === id
//                         ? {
//                             ...item,
//                             quantity:
//                                 item.quantity + 1,
//                         }
//                         : item
//             )
//         );
//     };

//     // =====================================================
//     // DECREASE QUANTITY
//     // =====================================================

//     const decreaseQty = (id) => {

//         setCart(
//             (currentCart) =>
//                 currentCart
//                     .map(
//                         (item) =>
//                             item.product === id
//                                 ? {
//                                     ...item,
//                                     quantity:
//                                         item.quantity - 1,
//                                 }
//                                 : item
//                     )
//                     .filter(
//                         (item) =>
//                             item.quantity > 0
//                     )
//         );
//     };

//     // =====================================================
//     // REMOVE
//     // =====================================================

//     const removeItem = (id) => {

//         setCart(
//             (currentCart) =>
//                 currentCart.filter(
//                     (item) =>
//                         item.product !== id
//                 )
//         );
//     };

//     // =====================================================
//     // TOTAL
//     // =====================================================

//     const total = cart.reduce(
//         (sum, item) =>
//             sum +
//             Number(item.price || 0) *
//             Number(item.quantity || 0),
//         0
//     );

//     // =====================================================
//     // CUSTOMER INPUT
//     // =====================================================

//     const handleCustomerChange = (e) => {

//         setCustomer({
//             ...customer,
//             [e.target.name]:
//                 e.target.value,
//         });
//     };

//     // =====================================================
//     // CREATE WALK-IN ORDER + INVOICE
//     // =====================================================

//     const placeOrder = async () => {

//         // =================================================
//         // VALIDATE CART
//         // =================================================

//         if (cart.length === 0) {

//             toast.error(
//                 "Please add at least one product"
//             );

//             return;
//         }

//         // =================================================
//         // VALIDATE CUSTOMER
//         // =================================================

//         if (
//             !customer.fullName ||
//             !customer.phone
//         ) {

//             toast.error(
//                 "Customer Name and Phone are required"
//             );

//             return;
//         }

//         // =================================================
//         // CHECK STOCK
//         // =================================================

//         for (const item of cart) {

//             if (
//                 item.quantity >
//                 item.availableStock
//             ) {

//                 toast.error(
//                     `${item.title}: only ${item.availableStock} item(s) available`
//                 );

//                 return;
//             }
//         }

//         // =================================================
//         // CHECK PRICE
//         // =================================================

//         for (const item of cart) {

//             if (
//                 Number(item.price || 0) <= 0
//             ) {

//                 toast.error(
//                     `${item.title}: Product price is missing or invalid.`
//                 );

//                 console.error(
//                     "INVALID WALK-IN PRODUCT PRICE:",
//                     item
//                 );

//                 return;
//             }
//         }

//         // =================================================
//         // PREPARE ORDER DATA
//         // =================================================

//         const orderData = {

//             orderItems:
//                 cart.map(
//                     (item) => ({

//                         product:
//                             item.product,

//                         title:
//                             item.title,

//                         quantity:
//                             Number(
//                                 item.quantity
//                             ),

//                         originalPrice:
//                             Number(
//                                 item.originalPrice ||
//                                 item.price ||
//                                 0
//                             ),

//                         price:
//                             Number(
//                                 item.price ||
//                                 0
//                             ),

//                         discountAmount:
//                             Number(
//                                 item.discountAmount ||
//                                 0
//                             ),

//                         imageUrl:
//                             item.imageUrl ||
//                             "",
//                     })
//                 ),

//             shippingAddress: {

//                 fullName:
//                     customer.fullName,

//                 phone:
//                     customer.phone,

//                 addressLine:
//                     customer.addressLine ||
//                     "Walk In Customer",

//                 city:
//                     customer.city ||
//                     "",

//                 state:
//                     customer.state ||
//                     "",

//                 pincode:
//                     customer.pincode ||
//                     "",

//                 country:
//                     customer.country ||
//                     "India",

//                 landmark:
//                     customer.landmark ||
//                     "",
//             },

//             totalAmount:
//                 Number(total),

//             paymentMethod,

//             orderSource:
//                 "WALK_IN",
//         };

//         // =================================================
//         // CREATE ORDER
//         // =================================================

//         try {

//             setPlacingOrder(true);

//             console.log(
//                 "WALK-IN ORDER DATA:",
//                 orderData
//             );

//             const res =
//                 await createWalkInOrder(
//                     orderData
//                 );

//             console.log(
//                 "WALK-IN ORDER RESPONSE:",
//                 res
//             );

//             // =============================================
//             // GET CREATED ORDER
//             // =============================================

//             const createdOrder =
//                 res?.order ||
//                 res?.data?.order ||
//                 res?.data;

//             console.log(
//                 "CREATED WALK-IN ORDER:",
//                 createdOrder
//             );

//             // =============================================
//             // CHECK ORDER ID
//             // =============================================

//             const createdOrderId =
//                 createdOrder?._id ||
//                 createdOrder?.id;

//             if (!createdOrderId) {

//                 console.error(
//                     "Created order response does not contain order ID:",
//                     res
//                 );

//                 throw new Error(
//                     "Order created but Order ID was not returned."
//                 );
//             }

//             // =============================================
//             // CREATE INVOICE
//             // =============================================

//             let createdInvoice = null;

//             try {

//                 console.log(
//                     "CREATING INVOICE FOR ORDER:",
//                     createdOrderId
//                 );

//                 const invoiceResponse =
//                     await createInvoice(
//                         createdOrderId
//                     );

//                 console.log(
//                     "INVOICE RESPONSE:",
//                     invoiceResponse
//                 );

//                 createdInvoice =
//                     invoiceResponse?.data ||
//                     invoiceResponse?.invoice ||
//                     invoiceResponse;

//                 console.log(
//                     "CREATED INVOICE:",
//                     createdInvoice
//                 );

//             } catch (
//                 invoiceError
//             ) {

//                 // =========================================
//                 // ORDER ALREADY CREATED.
//                 // DON'T BREAK WALK-IN FLOW.
//                 // =========================================

//                 console.error(
//                     "INVOICE CREATION ERROR:",
//                     invoiceError
//                 );

//                 toast.success(
//                     invoiceError?.response?.data?.message ||
//                     invoiceError?.message ||
//                     "Order created successfully, but invoice could not be created."
//                 );
//             }

//             // =============================================
//             // SHOW INVOICE
//             // =============================================

//             if (createdInvoice) {

//                 setInvoiceData(
//                     createdInvoice
//                 );

//             } else {

//                 setInvoiceData(
//                     createdOrder
//                 );
//             }

//             // =============================================
//             // SUCCESS
//             // =============================================

//             toast.success(
//                 "Walk-In Order Created Successfully"
//             );

//             // =============================================
//             // CLEAR CART
//             // =============================================

//             setCart([]);

//             // =============================================
//             // CLEAR CUSTOMER
//             // =============================================

//             setCustomer({

//                 fullName: "",

//                 phone: "",

//                 addressLine: "",

//                 city: "",

//                 state: "",

//                 pincode: "",

//                 country: "India",

//                 landmark: "",
//             });

//             // =============================================
//             // REFRESH PRODUCTS / INVENTORY
//             // =============================================

//             await loadProducts();

//         } catch (err) {

//             console.error(
//                 "CREATE WALK-IN ORDER ERROR:",
//                 err
//             );

//             toast.error(
//                 err?.response?.data?.message ||
//                 err?.message ||
//                 "Unable to create order"
//             );

//         } finally {

//             setPlacingOrder(false);

//         }
//     };

//     // =====================================================
//     // JSX
//     // =====================================================

//     return (

//         <div className="walkin-page">

//             {/* ==========================================
//                 LEFT SIDE
//             ========================================== */}

//             <div className="left-side">

//                 <h2>
//                     Product Search
//                 </h2>

//                 <input
//                     type="text"
//                     placeholder="Search product by Name or SKU..."
//                     value={search}
//                     onChange={(e) =>
//                         setSearch(
//                             e.target.value
//                         )
//                     }
//                     className="search-box"
//                 />

//                 {loading ? (

//                     <p>
//                         Loading products...
//                     </p>

//                 ) : filteredProducts.length === 0 ? (

//                     <p>
//                         No products found
//                     </p>

//                 ) : (

//                     <div className="product-list">

//                         {filteredProducts.map(
//                             (product) => {

//                                 // =================================
//                                 // EXTRA SAFETY
//                                 // =================================

//                                 if (
//                                     !isWalkInProduct(
//                                         product
//                                     )
//                                 ) {
//                                     return null;
//                                 }

//                                 const currentStock =
//                                     Number(
//                                         product.inventory?.currentStock ??
//                                         product.currentStock ??
//                                         product.availableStock ??
//                                         product.stock ??
//                                         0
//                                     );

//                                 const reservedStock =
//                                     Number(
//                                         product.inventory?.reservedStock ??
//                                         product.reservedStock ??
//                                         0
//                                     );

//                                 const availableStock =
//                                     Math.max(
//                                         currentStock -
//                                         reservedStock,
//                                         0
//                                     );

//                                 // =================================
//                                 // FIXED PRICE
//                                 // =================================

//                                 const sellingPrice =
//                                     getProductPrice(
//                                         product
//                                     );

//                                 return (

//                                     <div
//                                         key={
//                                             product._id
//                                         }
//                                         className="product-card"
//                                     >

//                                         {/* ==========================
//                                             PRODUCT IMAGE
//                                         ========================== */}

//                                         <img
//                                             src={
//                                                 product.images?.length
//                                                     ? `${import.meta.env.VITE_API_URL.replace("/api", "")}${product.images[0].url}`
//                                                     : "/no-image.png"
//                                             }
//                                             alt={
//                                                 product.name
//                                             }
//                                         />

//                                         {/* ==========================
//                                             PRODUCT NAME
//                                         ========================== */}

//                                         <h4>
//                                             {
//                                                 product.name
//                                             }
//                                         </h4>

//                                         {/* ==========================
//                                             SKU
//                                         ========================== */}

//                                         <p>
//                                             SKU:{" "}
//                                             {
//                                                 product.sku
//                                             }
//                                         </p>

//                                         {/* ==========================
//                                             PRODUCT TYPE
//                                         ========================== */}

//                                         <p>
//                                             Type:{" "}
//                                             {String(
//                                                 product.productType ??
//                                                 product.type ??
//                                                 product.product_type ??
//                                                 product.productCategoryType ??
//                                                 product.itemType ??
//                                                 ""
//                                             ).toUpperCase()}
//                                         </p>

//                                         {/* ==========================
//                                             STOCK
//                                         ========================== */}

//                                         <p>
//                                             Stock:{" "}
//                                             {
//                                                 availableStock
//                                             }
//                                         </p>

//                                         {/* ==========================
//                                             PRICE
//                                         ========================== */}

//                                         <h3>
//                                             ₹{" "}
//                                             {Number(
//                                                 sellingPrice
//                                             ).toLocaleString(
//                                                 "en-IN"
//                                             )}
//                                         </h3>

//                                         {/* ==========================
//                                             ADD BUTTON
//                                         ========================== */}

//                                         <button
//                                             type="button"
//                                             disabled={
//                                                 availableStock <= 0
//                                             }
//                                             onClick={() =>
//                                                 addProduct(
//                                                     product
//                                                 )
//                                             }
//                                         >

//                                             {availableStock <= 0
//                                                 ? "Out of Stock"
//                                                 : "+ Add"}

//                                         </button>

//                                     </div>
//                                 );
//                             }
//                         )}

//                     </div>
//                 )}

//             </div>

//             {/* ==========================================
//                 RIGHT SIDE
//             ========================================== */}

//             <div className="right-side">

//                 <h2>
//                     Cart
//                 </h2>

//                 {cart.length === 0 ? (

//                     <p>
//                         No Product Added
//                     </p>

//                 ) : (

//                     cart.map(
//                         (item) => (

//                             <div
//                                 className="cart-item"
//                                 key={
//                                     item.product
//                                 }
//                             >

//                                 <div>

//                                     <h4>
//                                         {
//                                             item.title
//                                         }
//                                     </h4>

//                                     <p>
//                                         SKU:{" "}
//                                         {
//                                             item.sku
//                                         }
//                                     </p>

//                                     <p>
//                                         ₹{" "}
//                                         {Number(
//                                             item.price || 0
//                                         ).toLocaleString(
//                                             "en-IN"
//                                         )}
//                                     </p>

//                                     <small>
//                                         Available:{" "}
//                                         {
//                                             item.availableStock
//                                         }
//                                     </small>

//                                 </div>

//                                 <div className="qty-box">

//                                     <button
//                                         type="button"
//                                         onClick={() =>
//                                             decreaseQty(
//                                                 item.product
//                                             )
//                                         }
//                                     >
//                                         -
//                                     </button>

//                                     <span>
//                                         {
//                                             item.quantity
//                                         }
//                                     </span>

//                                     <button
//                                         type="button"
//                                         onClick={() =>
//                                             increaseQty(
//                                                 item.product
//                                             )
//                                         }
//                                     >
//                                         +
//                                     </button>

//                                 </div>

//                                 <button
//                                     type="button"
//                                     className="remove-btn"
//                                     onClick={() =>
//                                         removeItem(
//                                             item.product
//                                         )
//                                     }
//                                 >
//                                     Remove
//                                 </button>

//                             </div>
//                         )
//                     )
//                 )}

//                 <hr />

//                 <h3>
//                     Grand Total: ₹{" "}
//                     {Number(
//                         total
//                     ).toLocaleString(
//                         "en-IN"
//                     )}
//                 </h3>

//                 <hr />

//                 <h2>
//                     Customer Details
//                 </h2>

//                 <input
//                     type="text"
//                     name="fullName"
//                     placeholder="Customer Name"
//                     value={
//                         customer.fullName
//                     }
//                     onChange={
//                         handleCustomerChange
//                     }
//                 />

//                 <input
//                     type="text"
//                     name="phone"
//                     placeholder="Phone Number"
//                     value={
//                         customer.phone
//                     }
//                     onChange={
//                         handleCustomerChange
//                     }
//                 />

//                 <input
//                     type="text"
//                     name="addressLine"
//                     placeholder="Address"
//                     value={
//                         customer.addressLine
//                     }
//                     onChange={
//                         handleCustomerChange
//                     }
//                 />

//                 <input
//                     type="text"
//                     name="city"
//                     placeholder="City"
//                     value={
//                         customer.city
//                     }
//                     onChange={
//                         handleCustomerChange
//                     }
//                 />

//                 <input
//                     type="text"
//                     name="state"
//                     placeholder="State"
//                     value={
//                         customer.state
//                     }
//                     onChange={
//                         handleCustomerChange
//                     }
//                 />

//                 <input
//                     type="text"
//                     name="pincode"
//                     placeholder="Pincode"
//                     value={
//                         customer.pincode
//                     }
//                     onChange={
//                         handleCustomerChange
//                     }
//                 />

//                 <select
//                     value={
//                         paymentMethod
//                     }
//                     onChange={(e) =>
//                         setPaymentMethod(
//                             e.target.value
//                         )
//                     }
//                 >

//                     <option value="CASH">
//                         Cash
//                     </option>

//                     <option value="CARD">
//                         Card
//                     </option>

//                     <option value="UPI">
//                         UPI
//                     </option>

//                 </select>

//                 <button
//                     type="button"
//                     className="place-order-btn"
//                     disabled={
//                         placingOrder ||
//                         cart.length === 0
//                     }
//                     onClick={
//                         placeOrder
//                     }
//                 >

//                     {placingOrder
//                         ? "Creating Order..."
//                         : "Create Walk-In Order"}

//                 </button>

//             </div>

//             {/* ==========================================
//                 INVOICE
//             ========================================== */}

//             {invoiceData && (

//                 <WalkInInvoice
//                     order={
//                         invoiceData
//                     }
//                     onClose={() =>
//                         setInvoiceData(
//                             null
//                         )
//                     }
//                 />

//             )}

//         </div>
//     );
// }

// export default NewWalkInOrder;


import { useEffect, useState } from "react";
import "./NewWalkInOrder.css";
import { toast } from "react-toastify";

import {
  getProducts,
  createWalkInOrder,
} from "../../../../services/walkInOrderService";

import WalkInInvoice from "../WalkInInvoice/WalkInInvoice";

import { createInvoice } from "../../../../services/invoiceService";

const API_URL = import.meta.env.VITE_API_URL;

const initialCustomer = {
  fullName: "",
  phone: "",
  addressLine: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  landmark: "",
};

function NewWalkInOrder() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [customer, setCustomer] = useState(initialCustomer);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [invoiceData, setInvoiceData] = useState(null);

  // Product type validation
  const isWalkInProduct = (product) => {
    if (!product) return false;

    const type = String(
      product.productType ??
      product.type ??
      product.product_type ??
      product.productCategoryType ??
      product.itemType ??
      ""
    ).trim().toUpperCase();

    return [
      "NEW",
      "NEW_PRODUCT",
      "REFURBISHED",
      "REFURBISH",
      "REFURB",
      "REFURBISHED_PRODUCT",
    ].includes(type);
  };

  // Get product price
  const getProductPrice = (product) => {
    if (!product) return 0;

    const prices = [
      product.pricing?.sellingPrice,
      product.pricing?.finalPrice,
      product.pricing?.retailPrice,
      product.pricing?.salePrice,
      product.pricing?.price,
      product.pricing?.amount,
      product.pricing?.selling_price,
      product.pricing?.final_price,
      product.pricing?.retail_price,
      product.pricing?.sale_price,

      product.sellingPrice,
      product.finalPrice,
      product.retailPrice,
      product.salePrice,
      product.price,
      product.amount,
      product.selling_price,
      product.final_price,
      product.retail_price,
      product.sale_price,

      product.product?.pricing?.sellingPrice,
      product.product?.pricing?.finalPrice,
      product.product?.pricing?.retailPrice,
      product.product?.sellingPrice,
      product.product?.finalPrice,
      product.product?.retailPrice,
      product.product?.price,
    ];

    for (const value of prices) {
      if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        !Number.isNaN(Number(value)) &&
        Number(value) >= 0
      ) {
        return Number(value);
      }
    }

    return 0;
  };

  // Stock helpers
  const getStock = (product) => {
    const current = Number(
      product.inventory?.currentStock ??
      product.currentStock ??
      product.availableStock ??
      product.stock ??
      0
    );

    const reserved = Number(
      product.inventory?.reservedStock ??
      product.reservedStock ??
      0
    );

    return Math.max(current - reserved, 0);
  };

  const getProductType = (product) => {
    return String(
      product.productType ??
      product.type ??
      product.product_type ??
      product.productCategoryType ??
      product.itemType ??
      ""
    ).trim().toUpperCase();
  };

  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });

  const getImageUrl = (product) => {
    const image = product.images?.[0]?.url;

    if (!image) return "/no-image.png";

    if (image.startsWith("http")) return image;

    return `${API_URL.replace("/api", "")}${image}`;
  };

  // Load products
  const loadProducts = async () => {
    try {
      setLoading(true);

      const data = await getProducts();

      const allProducts = Array.isArray(data)
        ? data
        : data?.products || data?.data || [];

      const walkInProducts = allProducts.filter(isWalkInProduct);

      setProducts(walkInProducts);
      setFilteredProducts(walkInProducts);
    } catch (error) {
      console.error("PRODUCT LOAD ERROR:", error);

      setProducts([]);
      setFilteredProducts([]);

      toast.error(
        error?.response?.data?.message ||
        "Unable to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Search products
  useEffect(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      setFilteredProducts(products);
      return;
    }

    const result = products.filter((product) => {
      const name = String(product.name || "").toLowerCase();
      const sku = String(product.sku || "").toLowerCase();

      return name.includes(value) || sku.includes(value);
    });

    setFilteredProducts(result);
  }, [search, products]);

  // Add product to cart
  const addProduct = (product) => {
    if (!isWalkInProduct(product)) {
      toast.error("Rental products cannot be added to Walk-In Order.");
      return;
    }

    const availableStock = getStock(product);

    if (availableStock <= 0) {
      toast.error("This product is out of stock.");
      return;
    }

    const sellingPrice = getProductPrice(product);

    if (sellingPrice <= 0) {
      toast.error("Product price is missing or invalid.");
      return;
    }

    const existingItem = cart.find(
      (item) => item.product === product._id
    );

    if (existingItem) {
      if (existingItem.quantity >= availableStock) {
        toast.error(`Only ${availableStock} item(s) available.`);
        return;
      }

      setCart((current) =>
        current.map((item) =>
          item.product === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );

      toast.success("Product quantity updated");
      return;
    }

    setCart((current) => [
      ...current,
      {
        product: product._id,
        title: product.name,
        sku: product.sku,
        quantity: 1,
        originalPrice: sellingPrice,
        price: sellingPrice,
        discountAmount: 0,
        imageUrl: product.images?.[0]?.url || "",
        availableStock,
      },
    ]);

    toast.success("Product added to cart");
  };

  // Increase quantity
  const increaseQty = (id) => {
    const item = cart.find((product) => product.product === id);

    if (!item) return;

    if (item.quantity >= item.availableStock) {
      toast.error(`Only ${item.availableStock} item(s) available.`);
      return;
    }

    setCart((current) =>
      current.map((product) =>
        product.product === id
          ? { ...product, quantity: product.quantity + 1 }
          : product
      )
    );
  };

  // Decrease quantity
  const decreaseQty = (id) => {
    setCart((current) =>
      current
        .map((item) =>
          item.product === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Remove item
  const removeItem = (id) => {
    setCart((current) =>
      current.filter((item) => item.product !== id)
    );
  };

  // Cart calculations
  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // Customer input
  const handleCustomerChange = (e) => {
    const { name, value } = e.target;

    setCustomer((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // Create order and invoice
  const placeOrder = async () => {
    if (cart.length === 0) {
      toast.error("Please add at least one product");
      return;
    }

    if (!customer.fullName.trim() || !customer.phone.trim()) {
      toast.error("Customer Name and Phone are required");
      return;
    }

    for (const item of cart) {
      if (item.quantity > item.availableStock) {
        toast.error(
          `${item.title}: only ${item.availableStock} item(s) available`
        );
        return;
      }

      if (Number(item.price || 0) <= 0) {
        toast.error(`${item.title}: Product price is invalid.`);
        return;
      }
    }

    const orderData = {
      orderItems: cart.map((item) => ({
        product: item.product,
        title: item.title,
        quantity: Number(item.quantity),
        originalPrice: Number(item.originalPrice || item.price || 0),
        price: Number(item.price || 0),
        discountAmount: Number(item.discountAmount || 0),
        imageUrl: item.imageUrl || "",
      })),

      shippingAddress: {
        fullName: customer.fullName,
        phone: customer.phone,
        addressLine: customer.addressLine || "Walk In Customer",
        city: customer.city || "",
        state: customer.state || "",
        pincode: customer.pincode || "",
        country: customer.country || "India",
        landmark: customer.landmark || "",
      },

      totalAmount: Number(total),
      paymentMethod,
      orderSource: "WALK_IN",
    };

    try {
      setPlacingOrder(true);

      const res = await createWalkInOrder(orderData);

      const createdOrder =
        res?.order ||
        res?.data?.order ||
        res?.data;

      const createdOrderId =
        createdOrder?._id ||
        createdOrder?.id;

      if (!createdOrderId) {
        throw new Error(
          "Order created but Order ID was not returned."
        );
      }

      let createdInvoice = null;

      try {
        const invoiceResponse = await createInvoice(createdOrderId);

        createdInvoice =
          invoiceResponse?.data ||
          invoiceResponse?.invoice ||
          invoiceResponse;
      } catch (invoiceError) {
        console.error("INVOICE CREATION ERROR:", invoiceError);

        toast.warning(
          invoiceError?.response?.data?.message ||
          "Order created, but invoice could not be created."
        );
      }

      setInvoiceData(createdInvoice || createdOrder);

      toast.success("Walk-In Order Created Successfully");

      setCart([]);
      setCustomer(initialCustomer);
      setPaymentMethod("CASH");

      await loadProducts();
    } catch (error) {
      console.error("CREATE WALK-IN ORDER ERROR:", error);

      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Unable to create order"
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="walkin-page">

      {/* PAGE HEADER */}
      <div className="walkin-header">
        <div>
          <span className="walkin-eyebrow">ORDER MANAGEMENT</span>
          <h1>Create Walk-In Order</h1>
          <p>Browse products, add items and create a customer order.</p>
        </div>

        <div className="walkin-header-badge">
          <span className="header-status-dot"></span>
          POS Sales
        </div>
      </div>

      <div className="walkin-layout">

        {/* LEFT PRODUCT SECTION */}
        <section className="left-side">

          <div className="section-heading">
            <div>
              <span className="section-kicker">PRODUCT CATALOGUE</span>
              <h2>Select Products</h2>
              <p>Choose products to add them to your order.</p>
            </div>

            <div className="product-count">
              {filteredProducts.length} Products
            </div>
          </div>

          {/* SEARCH */}
          <div className="product-search-wrapper">
            <span className="search-icon">⌕</span>

            <input
              type="text"
              placeholder="Search by product name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-box"
            />

            {search && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearch("")}
              >
                ×
              </button>
            )}
          </div>

          {/* PRODUCT FILTER INFO */}
          <div className="catalogue-info">
            <span>Available for walk-in sales</span>
            <div className="catalogue-types">
              <span className="type-legend new-legend">New</span>
              <span className="type-legend refurb-legend">Refurbished</span>
            </div>
          </div>

          {/* PRODUCTS */}
          {loading ? (
            <div className="walkin-empty">
              <div className="walkin-spinner"></div>
              <h3>Loading products</h3>
              <p>Please wait while we fetch your catalogue.</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="walkin-empty">
              <div className="empty-icon">⌕</div>
              <h3>No products found</h3>
              <p>Try searching with another product name or SKU.</p>
              {search && (
                <button
                  className="reset-search-btn"
                  onClick={() => setSearch("")}
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="product-list">
              {filteredProducts.map((product) => {
                if (!isWalkInProduct(product)) return null;

                const stock = getStock(product);
                const price = getProductPrice(product);
                const type = getProductType(product);

                const isRefurbished = type.includes("REFURB");
                const cartItem = cart.find(
                  (item) => item.product === product._id
                );

                return (
                  <article className="product-card" key={product._id}>

                    <div className="product-image-wrapper">
                      <img
                        src={getImageUrl(product)}
                        alt={product.name}
                        onError={(e) => {
                          e.currentTarget.src = "/no-image.png";
                        }}
                      />

                      <span
                        className={`product-type-badge ${
                          isRefurbished ? "refurbished" : "new"
                        }`}
                      >
                        {isRefurbished ? "Refurbished" : "New"}
                      </span>

                      {cartItem && (
                        <span className="in-cart-badge">
                          In Cart · {cartItem.quantity}
                        </span>
                      )}
                    </div>

                    <div className="product-card-content">

                      <span className="product-sku">
                        SKU: {product.sku || "N/A"}
                      </span>

                      <h3 title={product.name}>
                        {product.name}
                      </h3>

                      <div className="product-stock">
                        <span
                          className={`stock-indicator ${
                            stock <= 0
                              ? "out-stock"
                              : stock <= 5
                              ? "low-stock"
                              : "in-stock"
                          }`}
                        ></span>

                        {stock <= 0
                          ? "Out of stock"
                          : stock <= 5
                          ? `Only ${stock} left`
                          : `${stock} available`}
                      </div>

                      <div className="product-card-bottom">
                        <div className="product-price">
                          <span>Selling Price</span>
                          <strong>₹{formatPrice(price)}</strong>
                        </div>

                        <button
                          type="button"
                          className="add-product-btn"
                          disabled={stock <= 0 || price <= 0}
                          onClick={() => addProduct(product)}
                        >
                          {stock <= 0
                            ? "Unavailable"
                            : price <= 0
                            ? "Price Missing"
                            : cartItem
                            ? "+ Add More"
                            : "+ Add"}
                        </button>
                      </div>

                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* RIGHT SIDEBAR */}
        <aside className="right-side">

          {/* CART HEADER */}
          <div className="cart-header">
            <div>
              <span className="section-kicker">ORDER DETAILS</span>
              <h2>Shopping Cart</h2>
            </div>

            <span className="cart-count">{totalItems}</span>
          </div>

          {/* CART ITEMS */}
          <div className="cart-items-section">

            {cart.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-cart-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add products from the catalogue to get started.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div className="cart-item" key={item.product}>

                  <div className="cart-product-image">
                    <img
                      src={
                        item.imageUrl
                          ? item.imageUrl.startsWith("http")
                            ? item.imageUrl
                            : `${API_URL.replace("/api", "")}${item.imageUrl}`
                          : "/no-image.png"
                      }
                      alt={item.title}
                      onError={(e) => {
                        e.currentTarget.src = "/no-image.png";
                      }}
                    />
                  </div>

                  <div className="cart-item-info">
                    <h4>{item.title}</h4>
                    <span className="cart-sku">
                      SKU: {item.sku || "N/A"}
                    </span>

                    <strong>₹{formatPrice(item.price)}</strong>

                    <div className="qty-box">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => decreaseQty(item.product)}
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => increaseQty(item.product)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-actions">
                    <strong>
                      ₹{formatPrice(item.price * item.quantity)}
                    </strong>

                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeItem(item.product)}
                      title="Remove product"
                    >
                      ×
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>

          {/* PRICE SUMMARY */}
          <div className="cart-summary">
            <div className="summary-row">
              <span>Total Items</span>
              <strong>{totalItems}</strong>
            </div>

            <div className="summary-row">
              <span>Subtotal</span>
              <strong>₹{formatPrice(total)}</strong>
            </div>

            <div className="summary-divider"></div>

            <div className="grand-total-row">
              <span>Grand Total</span>
              <strong>₹{formatPrice(total)}</strong>
            </div>
          </div>

          {/* CUSTOMER DETAILS */}
          <div className="customer-section">
            <div className="customer-heading">
              <div>
                <span className="section-kicker">BILLING INFORMATION</span>
                <h2>Customer Details</h2>
              </div>
              <span className="required-note">* Required</span>
            </div>

            <div className="customer-form">

              <div className="form-group full-width">
                <label>Customer Name <span>*</span></label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter customer name"
                  value={customer.fullName}
                  onChange={handleCustomerChange}
                />
              </div>

              <div className="form-group full-width">
                <label>Phone Number <span>*</span></label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter phone number"
                  value={customer.phone}
                  onChange={handleCustomerChange}
                />
              </div>

              <div className="form-group full-width">
                <label>Address</label>
                <input
                  type="text"
                  name="addressLine"
                  placeholder="Street / House / Area"
                  value={customer.addressLine}
                  onChange={handleCustomerChange}
                />
              </div>

              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={customer.city}
                  onChange={handleCustomerChange}
                />
              </div>

              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={customer.state}
                  onChange={handleCustomerChange}
                />
              </div>

              <div className="form-group">
                <label>Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={customer.pincode}
                  onChange={handleCustomerChange}
                />
              </div>

              <div className="form-group">
                <label>Landmark</label>
                <input
                  type="text"
                  name="landmark"
                  placeholder="Nearby landmark"
                  value={customer.landmark}
                  onChange={handleCustomerChange}
                />
              </div>

              <div className="form-group full-width">
                <label>Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="CASH">Cash</option>
                  <option value="CARD">Card</option>
                  <option value="UPI">UPI</option>
                </select>
              </div>

            </div>
          </div>

          {/* CREATE ORDER */}
          <button
            type="button"
            className="place-order-btn"
            disabled={placingOrder || cart.length === 0}
            onClick={placeOrder}
          >
            {placingOrder ? (
              <>
                <span className="button-spinner"></span>
                Creating Order...
              </>
            ) : (
              <>
                Create Walk-In Order
                <span>→</span>
              </>
            )}
          </button>

          <p className="secure-order-note">
            Order details will be saved after confirmation.
          </p>

        </aside>
      </div>

      {/* INVOICE */}
      {invoiceData && (
        <WalkInInvoice
          order={invoiceData}
          onClose={() => setInvoiceData(null)}
        />
      )}

    </div>
  );
}

export default NewWalkInOrder;
