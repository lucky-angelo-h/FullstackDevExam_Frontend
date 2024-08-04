import React, { useState, useEffect} from 'react';
import { Link, useParams } from "react-router-dom";
import Modal from "../components/Modal";

interface Task {
  _id: string;
  title: string;
  description: string;
  member_id: string;
  priority: string;
  status: string;
  project_id: string;
}

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
];

const STATUS_OPTIONS = [
  { value: 'ASSESSMENT', label: 'Assessment' },
  { value: 'IN PROGRESS', label: 'In Progress' },
  { value: 'DONE', label: 'Done' },
];

const Tasks: React.FC = () => {
  const { id } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({ title: '', description: '', member_id: '', priority: '', status: '', project_id: id });
  const [updatedTask, setUpdatedTask] = useState({ title: '', description: '', member_id: '', priority: '', status: '', project_id: id });
  const [projectName, setProjectName] = useState('');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openUpdateModal = (task: Task) => {
    setCurrentTask(task);
    setUpdatedTask({ title: task.title, description: task.description, member_id: task.member_id, priority: task.priority, status: task.status, project_id: task.project_id });
    setIsUpdateModalOpen(true);
  };
  const closeUpdateModal = () => setIsUpdateModalOpen(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_ENDPOINT + '/tasks/project/' + id);
        const data = await response.json();
        if (data.code === 200) {
          setTasks(data.list);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } 
    };

    const fetchProject = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_ENDPOINT + '/projects/' + id);
        const data = await response.json();
        if (data.code === 200) {
          setMembers(data.list[0].member_id);
          setProjectName(data.list[0].title)
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchTasks();
    fetchProject();
  }, []);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(process.env.REACT_APP_API_ENDPOINT + '/tasks/create/' + id, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
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
      console.error('Error adding task:', error);
    }
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentTask) {
        const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/tasks/update/${currentTask._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedTask),
        });
        const data = await response.json();
        if (data.code === 200) {
          window.location.reload();
          closeUpdateModal();
        } else if (data.code === 400) {
          alert(data.message);
        } else {
          alert(data.message);
        }
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/tasks/delete/${taskId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.code === 200) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <>
      <button className="bg-blue-500 text-white py-2 px-4 rounded mb-4" onClick={openModal}>
        Create Task
      </button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h1 className="text-xl font-bold mb-4">Create Task</h1>
        <form onSubmit={handleAddTask}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="member_id">
              Member
            </label>
            <select
              id="member_id"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newTask.member_id}
              onChange={(e) => setNewTask({ ...newTask, member_id: e.target.value })}
              required
            >
              <option value="">Select a member</option>
              {members.map(member => (
                <option key={member._id} value={member._id}>
                  {member.firstname} {member.lastname}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="priority">
              Priority
            </label>
            <select
              id="priority"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              required
            >
                <option value="" disabled>Select a priority</option>
                {PRIORITY_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newTask.status}
              onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
              required
            >
                <option value="" disabled>Select a status</option>
                {STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add Task
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isUpdateModalOpen} onClose={closeUpdateModal}>
        <h1 className="text-xl font-bold mb-4">Update Task</h1>
        <form onSubmit={handleUpdateTask}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={updatedTask.title}
              onChange={(e) => setUpdatedTask({ ...updatedTask, title: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={updatedTask.description}
              onChange={(e) => setUpdatedTask({ ...updatedTask, description: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="member_id">
              Member ID
            </label>
            <select
              id="member_id"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={updatedTask.member_id}
              onChange={(e) => setUpdatedTask({ ...updatedTask, member_id: e.target.value })}
              required
            >
              <option value="" disabled>Select a member</option>
              {members.map(member => (
                <option key={member._id} value={member._id}>
                  {member.firstname} {member.lastname}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="priority">
              Priority
            </label>
            <select
              id="priority"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={updatedTask.priority}
              onChange={(e) => setUpdatedTask({ ...updatedTask, priority: e.target.value })}
              required
            >
                <option value="" disabled>Select a priority</option>
                {PRIORITY_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={updatedTask.status}
              onChange={(e) => setUpdatedTask({ ...updatedTask, status: e.target.value })}
              required
            >
                <option value="" disabled>Select a status</option>
                {STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Update Task
            </button>
          </div>
        </form>
      </Modal>
      <h1 className="text-2xl font-bold mb-4 mt-6">{projectName}</h1>
      <h1 className="text-2xl font-bold mb-4 mt-6">Tasks List</h1>
      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Title</th>
                <th className="py-2 px-4 border-b">Description</th>
                <th className="py-2 px-4 border-b">Priority</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td className="py-2 px-4 border-b">{task.title}</td>
                  <td className="py-2 px-4 border-b">{task.description}</td>
                  <td className="py-2 px-4 border-b">{task.priority}</td>
                  <td className="py-2 px-4 border-b">{task.status}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => openUpdateModal(task)}
                    >
                      Update
                    </button>
                    &nbsp;
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteTask(task._id)}
                    >
                      Delete
                    </button>
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

export default Tasks;