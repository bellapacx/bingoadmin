import { useEffect, useState } from "react";
import axios from "../services/api";
import Navbar from "../components/Navbar";
import WeeklyCommissions from "../components/WeeklyCommissions";

type Shop = {
  shop_id: string;
  username: string;
  balance: number;
};

type CommissionEntry = {
  round_id: string;
  amount: number;
};

export default function Shops({ onLogout }: { onLogout: () => void }) {
  const [shops, setShops] = useState<Shop[]>([]);
  const [form, setForm] = useState({
    shop_id: "",
    username: "",
    password: "",
    balance: "",
    billing_type: "prepaid",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [commissions, setCommissions] = useState<Record<string, CommissionEntry>>({});
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  console.log(commissions,startDate,endDate)
  const fetchShops = async () => {
    try {
      const res = await axios.get("https://bingoapi-qtai.onrender.com/shops");
      setShops(res.data);
    } catch (err) {
      console.error("Failed to fetch shops", err);
    }
  };

  const fetchCommissions = async (shopId: string) => {
    try {
      const res = await axios.get(`https://bingoapi-qtai.onrender.com/shop_commissions/${shopId}`);
      setCommissions(res.data.commissions || {});
    } catch (err) {
      console.error("Failed to fetch commissions", err);
      setCommissions({});
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("https://bingoapi-qtai.onrender.com/shops", {
        shop_id: form.shop_id,
        username: form.username,
        password: form.password,
        balance: parseFloat(form.balance),
        billing_type: form.billing_type,
      });
      setSuccess("Shop created successfully.");
      setError("");
      setForm({ shop_id: "", username: "", password: "", balance: "" ,billing_type: "prepaid",});
      fetchShops();
    } catch (err) {
      console.error(err);
      setError("Failed to create shop. Please check your inputs.");
      setSuccess("");
    }
  };

 const handleUpdate = async (e: React.FormEvent) => {
  e.preventDefault();

  const parsedBalance = parseFloat(form.balance);
  if (form.balance !== "" && isNaN(parsedBalance)) {
    setError("Invalid balance value.");
    return;
  }

  const updatePayload: any = {
    username: form.username,
  };

  if (form.password) {
    updatePayload.password = form.password;
  }

  if (form.balance !== "") {
    updatePayload.balance = parsedBalance;
  }

  if (form.billing_type !== "") {
    updatePayload.billing_type = form.billing_type;
  }

  try {
    await axios.put(`https://bingoapi-qtai.onrender.com/shops/${form.shop_id}`, updatePayload);

    setSuccess("Shop updated successfully.");
    setError("");
    setForm({ shop_id: "", username: "", password: "", balance: "", billing_type: "prepaid" });
    fetchShops();
  } catch (err) {
    console.error(err);
    setError("Failed to update shop.");
    setSuccess("");
  }
};


  const handleDelete = async (shopId: string) => {
    if (!confirm("Are you sure you want to delete this shop?")) return;
    try {
      await axios.delete(`https://bingoapi-qtai.onrender.com/shops/${shopId}`);
      setSuccess("Shop deleted successfully.");
      setError("");
      if (selectedShopId === shopId) {
        setSelectedShopId(null);
        setCommissions({});
      }
      fetchShops();
    } catch (err) {
      console.error(err);
      setError("Failed to delete shop.");
      setSuccess("");
    }
  };

  const onShopClick = (shopId: string) => {
    setSelectedShopId(shopId);
    setStartDate("");
    setEndDate("");
    fetchCommissions(shopId);
  };

  const isEditing = form.shop_id && shops.some(s => s.shop_id === form.shop_id);

  return (
    <div>
      <Navbar onLogout={onLogout} />
      <div className="p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">Shops</h1>

        {/* Form */}
        <form
          onSubmit={isEditing ? handleUpdate : handleCreate}
          className="bg-white/10 p-4 sm:p-6 rounded-lg mb-8 w-full max-w-xl mx-auto"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
            {isEditing ? "Edit Shop" : "Create Shop"}
          </h2>
          {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
          {success && <p className="text-green-400 text-sm mb-2">{success}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="shop_id"
              value={form.shop_id}
              onChange={handleChange}
              placeholder="Shop ID"
              className="p-2 rounded bg-gray-800 text-white border border-gray-700"
              required
             disabled={!!isEditing}

            />
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
              className="p-2 rounded bg-gray-800 text-white border border-gray-700"
              required
            />
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="p-2 rounded bg-gray-800 text-white border border-gray-700"
              required={!isEditing}
            />
            <input
              name="balance"
              type="number"
              step="0.01"
              value={form.balance}
              onChange={handleChange}
              placeholder="Balance"
              className="p-2 rounded bg-gray-800 text-white border border-gray-700"
              required
            />
            <select
  name="billing_type"
  value={form.billing_type}
  onChange={handleChange}
  className="p-2 rounded bg-gray-800 text-white border border-gray-700"
  required
>
  <option value="prepaid">Prepaid</option>
  <option value="postpaid">Postpaid</option>
</select>

          </div>

          <button
            type="submit"
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 transition-colors py-2 rounded font-semibold"
          >
            {isEditing ? "Update Shop" : "Create Shop"}
          </button>
        </form>

        {/* Shop Table */}
        <div className="bg-white/10 rounded-lg overflow-x-auto shadow-md mb-8">
          <table className="min-w-full table-auto text-white">
            <thead>
              <tr className="bg-white/20 text-left text-sm uppercase tracking-wider">
                <th className="p-4 whitespace-nowrap">Shop ID</th>
                <th className="p-4 whitespace-nowrap">Username</th>
                <th className="p-4 whitespace-nowrap">Balance</th>
                <th className="p-4 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shops.map((shop) => (
                <tr
                  key={shop.shop_id}
                  className={`border-t border-white/20 hover:bg-white/10 transition ${
                    selectedShopId === shop.shop_id ? "bg-indigo-700" : ""
                  }`}
                  onClick={() => onShopClick(shop.shop_id)}
                >
                  <td className="p-4">{shop.shop_id}</td>
                  <td className="p-4">{shop.username}</td>
                  <td className="p-4">{shop.balance.toFixed(2)}</td>
                  <td className="p-4 space-x-2">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-400 text-white px-3 py-1 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        setForm({
                          shop_id: shop.shop_id,
                          username: shop.username,
                          password: "",
                          balance: shop.balance.toString(),
                          billing_type: "prepaid",
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(shop.shop_id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedShopId && <WeeklyCommissions shopId={selectedShopId} />}
      </div>
    </div>
  );
}
