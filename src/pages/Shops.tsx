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
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [commissions, setCommissions] = useState<Record<string, CommissionEntry>>({});

  // New states for date filtering
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const fetchShops = async () => {
    try {
      const res = await axios.get("/shops");
      setShops(res.data);
    } catch (err) {
      console.error("Failed to fetch shops", err);
    }
  };

  const fetchCommissions = async (shopId: string) => {
    try {
      const res = await axios.get(`/shop_commissions/${shopId}`);
      setCommissions(res.data.commissions || {});
    } catch (err) {
      console.error("Failed to fetch commissions", err);
      setCommissions({});
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      });
      setSuccess("Shop created successfully.");
      setError("");
      setForm({ shop_id: "", username: "", password: "", balance: "" });
      fetchShops();
    } catch (err: any) {
      console.error(err);
      setError("Failed to create shop. Please check your inputs.");
      setSuccess("");
    }
  };

  const onShopClick = (shopId: string) => {
    setSelectedShopId(shopId);
    // Reset date filters on new selection
    setStartDate("");
    setEndDate("");
    fetchCommissions(shopId);
  };

  return (
    <div>
      <Navbar onLogout={onLogout}/>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-white mb-4">Shops</h1>

        {/* Create Shop Form */}
        <form onSubmit={handleCreate} className="bg-white/10 p-6 rounded-lg mb-8 max-w-xl">
          <h2 className="text-xl font-semibold text-white mb-4">Create Shop</h2>
          {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
          {success && <p className="text-green-400 text-sm mb-2">{success}</p>}
          <div className="grid grid-cols-2 gap-4">
            <input
              name="shop_id"
              value={form.shop_id}
              onChange={handleChange}
              placeholder="Shop ID"
              className="p-2 rounded bg-gray-800 text-white border border-gray-700"
              required
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
              required
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
          </div>
          <button
            type="submit"
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 transition-colors py-2 rounded font-semibold"
          >
            Create Shop
          </button>
        </form>

        {/* Shop Table */}
        <div className="bg-white/10 rounded-lg overflow-hidden shadow-md mb-8">
          <table className="min-w-full table-auto text-white">
            <thead>
              <tr className="bg-white/20 text-left text-sm uppercase tracking-wider">
                <th className="p-4">Shop ID</th>
                <th className="p-4">Username</th>
                <th className="p-4">Balance</th>
              </tr>
            </thead>
            <tbody>
              {shops.map((shop) => (
                <tr
                  key={shop.shop_id}
                  className={`border-t border-white/20 hover:bg-white/10 transition cursor-pointer ${
                    selectedShopId === shop.shop_id ? "bg-indigo-700" : ""
                  }`}
                  onClick={() => onShopClick(shop.shop_id)}
                >
                  <td className="p-4">{shop.shop_id}</td>
                  <td className="p-4">{shop.username}</td>
                  <td className="p-4">{shop.balance.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

         {selectedShopId && <WeeklyCommissions shopId={selectedShopId!} />}
      </div>
    </div>
  );
}
