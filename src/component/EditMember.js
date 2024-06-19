// src/components/EditMember.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";

const API_URL =
  "https://crudcrud.com/api/ade053b74b2c4502a6f9697ae0b25808/members";

const EditMember = ({ show, handleClose, memberId }) => {
  const [member, setMember] = useState({});

  useEffect(() => {
    if (memberId) {
      fetchMemberDetails();
    }
  }, [memberId]);

  const fetchMemberDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/${memberId}`);
      setMember(response.data);
    } catch (error) {
      console.error("Error fetching member details", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember({ ...member, [name]: value });
  };

  const handleSave = async () => {
    try {
      await axios.put(`${API_URL}/${memberId}`, member);
      toast.success("Member updated successfully");
      handleClose();
    } catch (error) {
      toast.error("Failed to update member");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Member</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={member.name || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="Email"
              value={member.Email || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formAge">
            <Form.Label>Age</Form.Label>
            <Form.Control
              type="number"
              name="age"
              value={member.age || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formParentId">
            <Form.Label>Parent ID</Form.Label>
            <Form.Control
              type="text"
              name="parent_id"
              value={member.parent_id || ""}
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

export default EditMember;
