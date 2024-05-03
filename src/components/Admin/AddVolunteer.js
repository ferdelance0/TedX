import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Modal,
  Box,
  TextField,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  MenuItem,
  FormControl,
  Select,
  Tabs,
  Tab,
} from "@mui/material";
import { styled } from "@mui/system";
import { FaBars, FaTimes } from "react-icons/fa";
import ksitmlogo from "../../images/logobanner.png";
import { useNavigate } from "react-router-dom";
import { removeToken } from "../../auth/auth";

const VolunteerManagementPage = () => {
  const navigate = useNavigate();
  const [volunteers, setVolunteers] = useState([]);
  const [events, setEvents] = useState({ scheduled: [], completed: [] });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");

  useEffect(() => {
    fetchVolunteers();
    fetchEvents();
  }, []);

  const fetchVolunteers = async () => {
    try {
      const response = await fetch("http://localhost:3000/get-security");
      if (response.ok) {
        const data = await response.json();
        const volunteersWithEvents = data.map((volunteer) => {
          const assignedEventIds = volunteer.assignedEvents || [];
          return {
            ...volunteer,
            assignedEvent: assignedEventIds,
          };
        });
        setVolunteers(volunteersWithEvents);
      } else {
        console.error("Error fetching volunteers:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching volunteers:", error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:3000/get-events");
      if (response.ok) {
        const data = await response.json();
        const currentDate = new Date();
        const scheduledEvents = data.filter((event) => {
          const eventDate = new Date(event.eventscheduleddate);
          return eventDate >= currentDate;
        });
        const completedEvents = data.filter((event) => {
          const eventDate = new Date(event.eventscheduleddate);
          return eventDate < currentDate;
        });
        setEvents({ scheduled: scheduledEvents, completed: completedEvents });
      } else {
        console.error("Error fetching events:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const getEventNames = (eventIds) => {
    return eventIds.map((eventId) => {
      const event =
        [...events.scheduled, ...events.completed].find(
          (event) => event._id === eventId
        ) || {};
      return event.eventname || "";
    });
  };

  const handleAssignEvent = async (volunteer) => {
    console.log(volunteer.assignedEvent);
    try {
      const response = await fetch("http://localhost:3000/update-assigned-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: volunteer._id,
          eventIds: volunteer.assignedEvent,
        }),
      });
      if (response.ok) {
        setModalMessage("Event assigned successfully");
      } else {
        setModalMessage("Error assigning event: " + response.statusText);
      }
      setShowModal(true);
      setLoading(false);
    } catch (error) {
      setModalMessage("Error assigning event: " + error);
      setShowModal(true);
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    try {
      setNewUsername(document.getElementById("username").value);
      setNewPassword(document.getElementById("password").value);
      console.log(newUsername, newPassword);
      const response = await fetch("http://localhost:3000/add-security", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: newUsername,
          password: newPassword,
        }),
      });
      if (response.ok) {
        setModalMessage("User added successfully");
      } else {
        setModalMessage("Error adding user: " + response.statusText);
      }
      setShowModal(true);
      setShowAddUserModal(false);
      setLoading(false);
    } catch (error) {
      setModalMessage("Error adding user: " + error);
      setShowModal(true);
      setShowAddUserModal(false);
      setLoading(false);
    }
  };

  const handleDashboard = () => {
    navigate("/admin/dashboard");
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOpenAddUserModal = () => {
    setShowAddUserModal(true);
  };

  const handleCloseAddUserModal = () => {
    setShowAddUserModal(false);
    setNewUsername("");
    setNewPassword("");
  };

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  let filteredVolunteers = [];

  if (selectedTab === "all") {
    filteredVolunteers = volunteers;
  } else if (selectedTab === "unassigned") {
    filteredVolunteers = volunteers.filter(
      (volunteer) => volunteer.assignedEvent.length === 0
    );
  } else {
    filteredVolunteers = volunteers.filter((volunteer) =>
      volunteer.assignedEvent.some((eventId) =>
        events[selectedTab].map((event) => event._id).includes(eventId)
      )
    );
  }

  const StyledDrawer = styled(Drawer)(({ theme }) => ({
    width: 240,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: 240,
      boxSizing: "border-box",
      backgroundColor: theme.palette.background.default,
    },
  }));

  const StyledListItem = styled(ListItem)(({ theme }) => ({
    paddingLeft: theme.spacing(4),
    color: theme.palette.text.primary,
  }));

  const StyledFormControl = styled(FormControl)(({ theme }) => ({
    minWidth: 200,
  }));

  const StyledSelect = styled(Select)(({ theme }) => ({
    "& .MuiSelect-select": {
      padding: theme.spacing(1),
      borderRadius: theme.shape.borderRadius,
      border: `1px solid ${theme.palette.grey[400]}`,
      "&:focus": {
        borderColor: theme.palette.primary.main,
      },
    },
  }));

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography variant="h4" component="h1">
            Volunteer Management
          </Typography>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleNav}
          >
            <FaBars />
          </IconButton>
        </Box>

        <StyledDrawer
          anchor="left"
          open={isOpen}
          onClose={toggleNav}
          variant="temporary"
        >
          <List>
            <ListItem>
              <img src={ksitmlogo} alt="Logo" style={{ width: "100%" }} />
            </ListItem>
            <StyledListItem button onClick={handleOpenAddUserModal}>
              <ListItemText primary="Add User" />
            </StyledListItem>
            <StyledListItem button onClick={handleDashboard}>
              <ListItemText primary="Back to dashboard" />
            </StyledListItem>
            <StyledListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </StyledListItem>
          </List>
        </StyledDrawer>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs value={selectedTab} onChange={handleTabChange} aria-label="Event Tabs">
            <Tab label="All Volunteers" value="all" />
            <Tab label="Unassigned" value="unassigned" />
            <Tab label="Scheduled Events" value="scheduled" />
            <Tab label="Completed Events" value="completed" />
          </Tabs>
        </Box>

        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Volunteer Name</TableCell>
                <TableCell>Assigned Event</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVolunteers.map((volunteer) => (
                <TableRow key={volunteer._id}>
                  <TableCell>{volunteer.email}</TableCell>
                  <TableCell>
                    <StyledFormControl>
                      <StyledSelect
                        multiple
                        value={volunteer.assignedEvent || []}
                        onChange={(e) => {
                          const selectedEventIds = e.target.value;
                          setVolunteers((prevVolunteers) =>
                            prevVolunteers.map((v) =>
                              v._id === volunteer._id
                                ? { ...v, assignedEvent: selectedEventIds }
                                : v
                            )
                          );
                        }}
                        renderValue={(selectedEventIds) =>
                          getEventNames(selectedEventIds).join(", ")
                        }
                      >
                        <MenuItem value="">Select Events</MenuItem>
                        {events.scheduled.map((event) => (
                          <MenuItem
                            key={event._id}
                            value={event._id}
                            selected={volunteer.assignedEvent.includes(event._id)}
                          >
                            {event.eventname}
                          </MenuItem>
                        ))}
                      </StyledSelect>
                    </StyledFormControl>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleAssignEvent(volunteer)}
                      disabled={volunteer.assignedEvent.length === 0}
                    >
                      Assign
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Modal
          open={showModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography id="modal-title" variant="h6" component="h2">
              Event Assignment
            </Typography>
            <Typography id="modal-description" sx={{ mt: 2 }}>
              {modalMessage}
            </Typography>
            <Button onClick={handleCloseModal} sx={{ mt: 2 }}>
              Close
            </Button>
          </Box>
        </Modal>

        <Modal
          open={showAddUserModal}
          onClose={handleCloseAddUserModal}
          aria-labelledby="add-user-modal-title"
          aria-describedby="add-user-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography id="add-user-modal-title" variant="h6" component="h2">
              Add User
            </Typography>
            <Box sx={{ mt: 2 }}>
              <TextField
                id="username"
                label="Username"
                variant="outlined"
                fullWidth
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <TextField
                id="password"
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
              />
            </Box>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={handleCloseAddUserModal} sx={{ mr: 2 }}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddUser}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Modal>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        )}
      </Container>
    </>
  );
};

export default VolunteerManagementPage;