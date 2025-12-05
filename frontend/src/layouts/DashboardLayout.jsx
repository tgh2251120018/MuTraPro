import { Link, Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className='flex'>
      <aside className='w-60 bg-base-300 min-h-screen p-4'>
        <h1 className='text-xl font-bold mb-4'>MuTra Dashboard</h1>

        <ul className='menu'>
          <li><Link to='/'>Trang chủ</Link></li>
          <li><Link to='/payment'>Thanh toán</Link></li>
          <li><Link to='/studio'>Studio</Link></li>
          <li><Link to='/profile'>Hồ sơ</Link></li>
        </ul>
      </aside>

      <main className='flex-1 p-6'>
        <Outlet />
      </main>
    </div>
  );
}
