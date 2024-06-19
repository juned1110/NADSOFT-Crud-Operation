// src/components/ListMembers.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import { Table, Button, Form } from "react-bootstrap";
import EditMember from "./EditMember";
import AddMember from "./AddMember";

const API_URL =
  "https://crudcrud.com/api/ade053b74b2c4502a6f9697ae0b25808/members";

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
    <div className="container mt-5">
      <h2>Members List</h2>
      <Button variant="primary" className="mb-3" onClick={handleShowAddModal}>
        Add New Member
      </Button>
      <Form.Control
        type="text"
        placeholder="Search by name"
        className="mb-3"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Member Name</th>
            <th>Member Email</th>
            <th>Age</th>
            <th>Parent ID</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {console.log(currentMembers)}
          {currentMembers.map((member) => (
            <tr key={member._id}>
              <td>{member._id}</td>
              <td>
                <a href="#" onClick={() => handleEditMember(member._id)}>
                  {member.name}
                </a>
              </td>
              <td>
                <a href="#" onClick={() => handleEditMember(member._id)}>
                  {member.Email}
                </a>
              </td>
              <td>{member.age}</td>
              <td>{member.parent_id}</td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => deleteMember(member._id)}
                >
                  Delete
                </Button>
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
