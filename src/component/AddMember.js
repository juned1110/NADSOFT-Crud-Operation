import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const API_URL =
  "https://crudcrud.com/api/b069d567089e49e8a2955ef17593f19e/members";

const AddMember = ({ show, handleClose, fetchMembers }) => {
  const [member, setMember] = useState({
    name: "",
    Email: "",
    age: "",
    parent_id: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember({ ...member, [name]: value });
  };

  const handleSave = async () => {
    try {
      console.log("Sending POST request with payload:", member); 
      const response = await axios.post(API_URL, member);
      console.log("POST request successful with response:", response); 
      toast.success("Member added successfully");
      handleClose();
      fetchMembers();
    } catch (error) {
      console.error("Error adding member:", error); 
      toast.error("Failed to add member");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Member</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={member.name}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="Email"
              value={member.Email}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Age</Form.Label>
            <Form.Control
              type="number"
              name="age"
              value={member.age}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Parent ID</Form.Label>
            <Form.Control
              type="text"
              name="parent_id"
              value={member.parent_id}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
      <ToastContainer />
    </Modal>
  );
};

export default AddMember;
