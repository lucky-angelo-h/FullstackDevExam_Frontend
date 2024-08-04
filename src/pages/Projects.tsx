import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Modal from "../components/Modal";

interface MemberId {
  _id: string;
  firstname: string;
  lastname: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  member_id: MemberId[];
}

const MAX_SELECTIONS = 5;

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<MemberId[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState({ title: '', description: '', member_id: [] as MemberId[] });
  const [updatedProject, setUpdatedProject] = useState({ title: '', description: '', member_id: [] as MemberId[] });
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openUpdateModal = (project: Project) => {
    setCurrentProject(project);
    setUpdatedProject({ title: project.title, description: project.description, member_id: project.member_id });
    setIsUpdateModalOpen(true);
  };
  const closeUpdateModal = () => setIsUpdateModalOpen(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_ENDPOINT + '/projects/');
        const data = await response.json();
        if (data.code === 200) {
          setProjects(data.list);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_ENDPOINT + '/users/');
        const data = await response.json();
        if (data.code === 200) {
          setUsers(data.list);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchProjects();
    fetchUsers();
  }, []);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(process.env.REACT_APP_API_ENDPOINT + '/projects/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
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
      console.error('Error adding project:', error);
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentProject) {
        const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/projects/update/${currentProject._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedProject),
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
      console.error('Error updating project:', error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/projects/delete/${projectId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.code === 200) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>, isUpdate: boolean) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => ({
      _id: option.value,
      firstname: option.getAttribute('data-firstname') || '',
      lastname: option.getAttribute('data-lastname') || ''
    }));

    if (selectedOptions.length > MAX_SELECTIONS) {
      alert(`You can select a maximum of ${MAX_SELECTIONS} members.`);
      return;
    }

    if (isUpdate) {
      setUpdatedProject({ ...updatedProject, member_id: selectedOptions });
    } else {
      setNewProject({ ...newProject, member_id: selectedOptions });
    }
  };

  return (
    <>
      <button className="bg-blue-500 text-white py-2 px-4 rounded mb-4" onClick={openModal}>
        Create Project
      </button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h1 className="text-xl font-bold mb-4">Create Project</h1>
        <form onSubmit={handleAddProject}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
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
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="members">
              Members
            </label>
            <select
              id="members"
              multiple
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newProject.member_id.map(member => member._id)}
              onChange={(e) => handleUserChange(e, false)}
            >
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.firstname} {user.lastname}
                </option>
              ))}
            </select>
          </div>
          { showError ? 
            <div className="error-div text-red-500 hover:text-red-700 m-5">
              {errorMessage}
            </div> 
            : ''}
          
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add Project
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isUpdateModalOpen} onClose={closeUpdateModal}>
        <h1 className="text-xl font-bold mb-4">Update Project</h1>
        <form onSubmit={handleUpdateProject}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={updatedProject.title}
              onChange={(e) => setUpdatedProject({ ...updatedProject, title: e.target.value })}
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
              value={updatedProject.description}
              onChange={(e) => setUpdatedProject({ ...updatedProject, description: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="members">
              Members
            </label>
            <select
              id="members"
              multiple
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={updatedProject.member_id.map(member => member._id)}
              onChange={(e) => handleUserChange(e, true)}
            >
              {users.map(user => (
                <option key={user._id} value={user._id} data-firstname={user.firstname} data-lastname={user.lastname}>
                  {user.firstname} {user.lastname}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Update Project
            </button>
          </div>
        </form>
      </Modal>

      <h1 className="text-2xl font-bold mb-4 mt-6">Projects List</h1>
      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Title</th>
                <th className="py-2 px-4 border-b">Description</th>
                <th className="py-2 px-4 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project._id}>
                  <td className="py-2 px-4 border-b">
                    <Link to={"/project/"+project._id} className="hover:underline text-blue-500 hover:text-blue-700">{project.title}</Link>
                  </td>
                  <td className="py-2 px-4 border-b">{project.description}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => openUpdateModal(project)}
                    >
                      Update
                    </button>
                    &nbsp;
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteProject(project._id)}
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

export default Projects;