import { useEffect, useState } from "react";
import axios from "../services/api";

type Shop = {
  shop_id: string;
  username: string;
  balance: number;
};

export default function ShopList() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchShops = async () => {
    try {
      const res = await axios.get("https://corebingoapi.onrender.com/shops");
      setShops(res.data);
    } catch (err) {
      console.error("Error fetching shops:", err);
      setError("Failed to load shops.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  if (loading) return <p className="text-white">Loading shops...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div className="bg-white/10 rounded-lg overflow-hidden shadow-md text-white">
      <table className="min-w-full table-auto">
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
              className="border-t border-white/20 hover:bg-white/10 transition"
            >
              <td className="p-4">{shop.shop_id}</td>
              <td className="p-4">{shop.username}</td>
              <td className="p-4">{shop.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
