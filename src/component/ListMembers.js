import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import { Table, Button, Form } from "react-bootstrap";
import EditMember from "./EditMember";
import AddMember from "./AddMember";

const API_URL =
  "https://crudcrud.com/api/b069d567089e49e8a2955ef17593f19e/members";

const ListMembers = () => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [membersPerPage] = useState(5);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    setFilteredMembers(
      members.filter((member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, members]);

  const fetchMembers = async () => {
    try {
      const response = await axios.get(API_URL);
      setMembers(response.data);
      setFilteredMembers(response.data);
    } catch (error) {
      console.error("Error fetching members", error);
    }
  };

  const deleteMember = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        toast.success("Member deleted successfully");
        fetchMembers();
      } catch (error) {
        toast.error("Failed to delete member");
      }
    }
  };

  const handleEditMember = (id) => {
    setSelectedMemberId(id);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedMemberId(null);
    fetchMembers();
  };

  const handleShowAddModal = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    fetchMembers();
  };

  // Pagination logic
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = filteredMembers.slice(
    indexOfFirstMember,
    indexOfLastMember
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-5 ">
      <h2>All Members</h2>

      <div className="border p-3">
        <div className="input-div">
          <Form.Control
            type="text"
            placeholder="Search by name"
            className="mb-3 input"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            className="mb-3 btn-success btn-add-member "
            onClick={handleShowAddModal}
          >
            Add New Member
          </Button>
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Member Name</th>
              <th>Member Email</th>
              <th>Age</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentMembers.map((member) => (
              <tr key={member._id}>
                <td>{member.parent_id}</td>
                <td className="name">
                  <a onClick={() => handleEditMember(member._id)}>
                    {member.name}
                  </a>
                </td>
                <td className="email">
                  <a onClick={() => handleEditMember(member._id)}>
                    {member.Email}
                  </a>
                </td>
                <td>{member.age}</td>
                <td className="action">
                  <div className="delete-action">
                    <svg
                      onClick={() => deleteMember(member._id)}
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="red"
                      className="bi bi-trash3-fill ms-3"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                    </svg>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Pagination
          membersPerPage={membersPerPage}
          totalMembers={filteredMembers.length}
          paginate={paginate}
        />
        <EditMember
          show={showEditModal}
          handleClose={handleCloseEditModal}
          memberId={selectedMemberId}
        />
        <AddMember
          show={showAddModal}
          handleClose={handleCloseAddModal}
          fetchMembers={fetchMembers}
        />
        <ToastContainer />
      </div>
    </div>
  );
};

const Pagination = ({ membersPerPage, totalMembers, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalMembers / membersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <a onClick={() => paginate(number)} href="#" className="page-link">
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default ListMembers;
