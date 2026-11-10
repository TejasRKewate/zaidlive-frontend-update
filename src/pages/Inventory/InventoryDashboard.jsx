import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import AddStockModal from "./AddStockModal";
import { getInventory, addStock, removeStock, deleteInventory } from "../../services/inventoryService";
import { getMyNotifications } from "../../services/notificationService";
import "./InventoryDashboard.css";

const getList = (res) => {
  const candidates = [res?.data?.data, res?.data?.inventory, res?.data, res?.inventory];
  return candidates.find(Array.isArray) || [];
};

const getNotifications = (res) => {
  const candidates = [res?.notifications, res?.data?.notifications, res?.data?.data?.notifications, res?.data?.data];
  return candidates.find(Array.isArray) || [];
};

const getAvailableStock = (item) => {
  if (item?.availableStock !== undefined && item?.availableStock !== null) {
    return Number(item.availableStock) || 0;
  }
  return (Number(item?.currentStock) || 0) - (Number(item?.reservedStock) || 0);
};

const getStockStatus = (item) => {
  // Preserves original current-minus-reserved stock calculation.
  const available = Math.max((Number(item?.currentStock) || 0) - (Number(item?.reservedStock) || 0), 0);
  if (available === 0) return "OUT_OF_STOCK";
  if (available <= 5) return "LOW_STOCK";
  return "IN_STOCK";
};

const getImageUrl = (image) => {
  const path = typeof image === "string" ? image : image?.url;
  if (!path) return "";
  if (/^https?:\/\//i.test(path) || path.startsWith("data:")) return path;
  const api = (import.meta.env.VITE_API_URL || "/api").replace(/\/+$/, "");
  const base = api.replace(/\/api$/i, "");
  return `${base}/${String(path).replace(/^\/+/, "")}`;
};

export default function InventoryDashboard() {
  const [searchParams] = useSearchParams();
  const notificationProductId = searchParams.get("product");
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [inventoryUnreadCount, setInventoryUnreadCount] = useState(0);
  const [deletingId, setDeletingId] = useState(null);

  const loadInventory = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getInventory();
      console.log("INVENTORY RESPONSE:", res.data);
      setInventory(getList(res));
    } catch (error) {
      console.error("INVENTORY ERROR:", error);
      setInventory([]);
      toast.error(error?.response?.data?.message || "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadInventoryNotifications = useCallback(async () => {
    try {
      const res = await getMyNotifications();
      const unread = getNotifications(res).filter((n) =>
        (n.type === "STOCK_LOW" || n.type === "STOCK_OUT") &&
        n.isRead !== true && n.read !== true && String(n.status || "").toUpperCase() !== "READ"
      ).length;
      setInventoryUnreadCount(unread);
    } catch (error) {
      console.error("INVENTORY NOTIFICATION ERROR:", error);
    }
  }, []);

  useEffect(() => { loadInventory(); }, [loadInventory]);
  useEffect(() => {
    loadInventoryNotifications();
    const interval = setInterval(loadInventoryNotifications, 15000);
    return () => clearInterval(interval);
  }, [loadInventoryNotifications]);

  const openAddStock = (item) => {
    setSelectedProduct(item);
    setShowModal(true);
  };

  const handleAddStock = async (productId, quantity) => {
    try {
      await addStock({ productId, quantity: Number(quantity) });
      toast.success("Stock Added Successfully");
      setShowModal(false);
      setSelectedProduct(null);
      await loadInventory();
      await loadInventoryNotifications();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to add stock");
    }
  };

  const handleRemoveStock = async (productId) => {
    const qty = window.prompt("Enter quantity to remove");
    if (qty === null || qty.trim() === "") return;
    const quantity = Number(qty);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      toast.error("Enter valid whole-number quantity");
      return;
    }
    try {
      await removeStock({ productId, quantity });
      toast.success("Stock Removed Successfully");
      await loadInventory();
      await loadInventoryNotifications();
    } catch (error) {
      console.error("REMOVE STOCK ERROR:", error);
      toast.error(error?.response?.data?.message || "Failed to remove stock");
    }
  };

  const handleDelete = async (item) => {
    // Delete the inventory RECORD, not the product catalog item.
    const inventoryId = item?._id || item?.id;
    if (!inventoryId) {
      toast.error("Inventory record ID is missing");
      return;
    }
    const name = item?.product?.name || "this inventory record";
    if (!window.confirm(`Delete inventory record for "${name}"?\n\nThis action may be permanent. It does NOT delete the product from the product catalog.`)) return;
    try {
      setDeletingId(String(inventoryId));
      await deleteInventory(inventoryId);
      toast.success("Inventory record deleted successfully");
      await loadInventory();
      await loadInventoryNotifications();
    } catch (error) {
      console.error("DELETE INVENTORY ERROR:", error);
      toast.error(error?.response?.data?.message || "Failed to delete inventory record. Check API permissions and endpoint.");
    } finally {
      setDeletingId(null);
    }
  };

  const summary = useMemo(() => ({
    totalProducts: inventory.length,
    inStock: inventory.filter((x) => getStockStatus(x) === "IN_STOCK").length,
    lowStock: inventory.filter((x) => getStockStatus(x) === "LOW_STOCK").length,
    outOfStock: inventory.filter((x) => getStockStatus(x) === "OUT_OF_STOCK").length,
    totalStock: inventory.reduce((sum, x) => sum + (Number(x.currentStock) || 0), 0),
  }), [inventory]);

  const filteredInventory = useMemo(() => inventory.filter((item) => {
    const p = item?.product;
    if (!p) return false;
    if (notificationProductId && String(p._id || p.id) !== String(notificationProductId)) return false;
    const query = search.trim().toLowerCase();
    const searchable = [p.name, p.sku, p.brand?.name, p.category?.name].map((x) => String(x || "").toLowerCase());
    return searchable.some((x) => x.includes(query)) && (statusFilter === "ALL" || getStockStatus(item) === statusFilter);
  }), [inventory, notificationProductId, search, statusFilter]);

  const statusText = (status) => ({ IN_STOCK: "In Stock", LOW_STOCK: "Low Stock", OUT_OF_STOCK: "Out Of Stock" }[status] || status || "-");

  return (
    <div className="inventory-dashboard">
      <div className="inventory-page-header">
        <div><h1>Inventory Management</h1><p>Manage products and stock</p></div>
      </div>
      <div className="inventory-notification-badge" aria-label={`${inventoryUnreadCount} unread inventory notifications`}>
        🔔 {inventoryUnreadCount > 0 && <span>{inventoryUnreadCount}</span>}
      </div>

      <div className="inventory-cards">
        <div className="card blue"><h3>Total Products</h3><h2>{summary.totalProducts}</h2></div>
        <div className="card green"><h3>In Stock</h3><h2>{summary.inStock}</h2></div>
        <div className="card orange"><h3>Low Stock</h3><h2>{summary.lowStock}</h2></div>
        <div className="card red"><h3>Out Of Stock</h3><h2>{summary.outOfStock}</h2></div>
        <div className="card purple"><h3>Total Stock</h3><h2>{summary.totalStock}</h2></div>
      </div>

      <div className="inventory-top">
        <input type="text" placeholder="Search product, SKU, brand, category..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="ALL">All Status</option>
          <option value="IN_STOCK">In Stock</option>
          <option value="LOW_STOCK">Low Stock</option>
          <option value="OUT_OF_STOCK">Out Of Stock</option>
        </select>
      </div>

      {loading ? <div className="inventory-loading">Loading inventory...</div> : (
        <div className="inventory-table-wrapper">
          <table className="inventory-table">
            <thead><tr>
              <th>#</th><th>Image</th><th>Product</th><th>SKU</th><th>Brand</th><th>Category</th>
              <th>Price</th><th>Current</th><th>Reserved</th><th>Available</th><th>Min</th><th>Max</th><th>Status</th><th>Action</th>
            </tr></thead>
            <tbody>
              {filteredInventory.length ? filteredInventory.map((item, index) => {
                const product = item.product;
                const status = getStockStatus(item);
                const image = product?.images?.length ? getImageUrl(product.images[0]) : "";
                const isDeleting = deletingId === String(item._id || item.id);
                return (
                  <tr key={item._id || item.id || index}>
                    <td>{index + 1}</td>
                    <td>{image ? <img src={image} alt={product?.name || "Product"} className="inventory-image" /> : <div className="inventory-no-image">No Image</div>}</td>
                    <td><strong>{product?.name || "-"}</strong></td>
                    <td>{product?.sku || "-"}</td>
                    <td>{product?.brand?.name || "-"}</td>
                    <td>{product?.category?.name || "-"}</td>
                    <td>₹ {product?.pricing?.sellingPrice ?? 0}</td>
                    <td><strong>{item.currentStock ?? 0}</strong></td>
                    <td>{item.reservedStock ?? 0}</td>
                    <td><strong>{getAvailableStock(item)}</strong></td>
                    <td>{item.minimumStock ?? 0}</td>
                    <td>{item.maximumStock ?? 0}</td>
                    <td><span className={status === "IN_STOCK" ? "status in-stock" : status === "LOW_STOCK" ? "status low-stock" : "status out-stock"}>{statusText(status)}</span></td>
                    <td><div className="inventory-actions">
                      <button type="button" className="add-btn" disabled={isDeleting} onClick={() => openAddStock(item)}>+ Stock</button>
                      <button type="button" className="remove-btn" disabled={isDeleting} onClick={() => handleRemoveStock(product._id)}>− Stock</button>
                      <button type="button" className="inventory-delete-btn" disabled={isDeleting} onClick={() => handleDelete(item)}>{isDeleting ? "Deleting..." : "Delete"}</button>
                    </div></td>
                  </tr>
                );
              }) : <tr><td colSpan={14} className="no-data">No Product Found</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {showModal && selectedProduct && <AddStockModal
        product={selectedProduct}
        onClose={() => { setShowModal(false); setSelectedProduct(null); }}
        onSave={handleAddStock}
      />}
    </div>
  );
}
