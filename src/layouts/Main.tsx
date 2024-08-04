import { Outlet, Link } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-blue-500 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-lg font-bold">Project Management</div>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:underline">Home</Link>
            </li>
            <li>
              <Link to="/users" className="hover:underline">Users</Link>
            </li>
          </ul>
        </div>
      </nav>

      <main className="flex-grow container mx-auto p-4">
        <Outlet />
      </main>

      
    </div>
  );
};

export default MainLayout;