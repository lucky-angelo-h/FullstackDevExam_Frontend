import React, { useState, useEffect, useReducer } from 'react';
import Modal from "../components/Modal";

interface User {
  _id: string;
  firstname: string;
  lastname: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({ firstname: '', lastname: '' });
  const [updatedUser, setUpdatedUser] = useState({ firstname: '', lastname: '' });


  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openUpdateModal = (user: User) => {
    setCurrentUser(user);
    setUpdatedUser({ firstname: user.firstname, lastname: user.lastname });
    setIsUpdateModalOpen(true);
  };
  const closeUpdateModal = () => setIsUpdateModalOpen(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_ENDPOINT + '/users/');
        
          const data = await response.json();
          console.log(data);
          if(data.code == 200) {
            setUsers(data.list);
          }
          
        
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(process.env.REACT_APP_API_ENDPOINT + '/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      const data = await response.json();
      if (data.code === 200) {
        window.location.reload();
        closeModal();
      } else if (data.code === 400) {
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentUser) {
        const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/users/update/${currentUser._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedUser),
        });
        const data = await response.json();
        if (data.code === 200) {
          // setUsers(users.map(user => (user._id === currentUser._id ? data.user : user)));
          window.location.reload();
          closeUpdateModal();
        } else if (data.code === 400) {
          alert(data.message);
        } else {
          alert(data.message);
        }
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <>
      <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={openModal}>
        Create User
      </button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h1 className="text-xl font-bold mb-4">Create User</h1>
        <form onSubmit={handleAddUser}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstname">
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newUser.firstname}
              onChange={(e) => setNewUser({ ...newUser, firstname: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastname">
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newUser.lastname}
              onChange={(e) => setNewUser({ ...newUser, lastname: e.target.value })}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add User
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isUpdateModalOpen} onClose={closeUpdateModal}>
        <h1 className="text-xl font-bold mb-4">Update User</h1>
        <form onSubmit={handleUpdateUser}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstname">
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={updatedUser.firstname}
              onChange={(e) => setUpdatedUser({ ...updatedUser, firstname: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastname">
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={updatedUser.lastname}
              onChange={(e) => setUpdatedUser({ ...updatedUser, lastname: e.target.value })}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Update User
            </button>
          </div>
        </form>
      </Modal>

      <h1 className="text-2xl font-bold mb-4 mt-6">Users List</h1>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b w-4/5">Name</th>
                <th className="py-2 px-4 border-b w-1/5">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="py-2 px-4 border-b">{user.firstname} {user.lastname}</td>
                  <td className="py-2 px-4 border-b">
                    <a className="hover:cursor-pointer text-blue-500" onClick={() => openUpdateModal(user)}>
                      Update User
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Users;