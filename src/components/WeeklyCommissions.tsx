import { useEffect, useState } from "react";
import axios from "../services/api"; // ✅ Use your local axios config, not default axios

interface WeeklyCommission {
  week_id: string;
  week: string;
  total_commission: number;
  total_payment: number;
  payment_status: "paid" | "unpaid";
}

export default function WeeklyCommissions({ shopId }: { shopId: string | null }) {
  const [commissions, setCommissions] = useState<WeeklyCommission[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCommissions = async () => {
    if (!shopId) return;
    setLoading(true);
    try {
      const res = await axios.get(`https://bingoapi-qtai.onrender.com/shop_commissions/${shopId}`);
      setCommissions(res.data?.weekly_commissions || []);
    } catch (err) {
      console.error("Failed to fetch commissions", err);
      setCommissions([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async (weekId: string) => {
    try {
      await axios.post(`https://corebingoapi.onrender.com/shop_commissions/${shopId}/pay/${weekId}`);
      fetchCommissions(); // Refresh
    } catch (err) {
      console.error("Failed to mark as paid", err);
    }
  };

  useEffect(() => {
    fetchCommissions();
  }, [shopId]);

  if (!shopId) {
    return <div className="p-4 text-white">No shop selected.</div>;
  }

  return (
    <div className="p-4 bg-white/10 text-white rounded-lg">
      <h2 className="text-xl font-bold mb-4">Weekly Commissions</h2>

      {loading ? (
        <p>Loading...</p>
      ) : commissions.length === 0 ? (
        <p>No commissions found.</p>
      ) : (
        <table className="min-w-full table-auto text-sm">
          <thead>
            <tr className="bg-white/20">
              <th className="p-2 text-left">Week</th>
              <th className="p-2 text-left">Total Commission</th>
              <th className="p-2 text-left">Payment Amount</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {commissions.map((item) => (
              <tr key={item.week_id} className="border-t border-white/10">
                <td className="p-2">{item.week}</td>
                <td className="p-2">ETB{item.total_commission.toFixed(2)}</td>
                <td className="p-2">ETB{item.total_payment.toFixed(2)}</td>
                <td className="p-2">
                  {item.payment_status === "paid" ? (
                    <span className="text-green-400 font-semibold">Paid</span>
                  ) : (
                    <span className="text-yellow-400 font-semibold">Unpaid</span>
                  )}
                </td>
                <td className="p-2">
                  {item.payment_status === "unpaid" && (
                    <button
                      onClick={() => markAsPaid(item.week_id)}
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white"
                    >
                      Mark Paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
