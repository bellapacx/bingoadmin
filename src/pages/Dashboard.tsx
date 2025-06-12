import Navbar from "../components/Navbar";


export default function Dashboard({ onLogout }: { onLogout: () => void }) {



  return (
    <div>
      <Navbar onLogout={onLogout}/>
      <div className="p-6 text-white">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Total Shops</h2>
            <p className="text-2xl mt-2">12</p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Total Games</h2>
            <p className="text-2xl mt-2">87</p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Recent Winners</h2>
            <p className="text-2xl mt-2">25</p>
          </div>
        </div>
      </div>
    </div>
  );
}
