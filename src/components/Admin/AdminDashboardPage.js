import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ksitmlogo from "../../images/logobanner.png";
import {
  Container,
  Box,
  Typography,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Zoom,
  Slide,
  Fade,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/system";
import { FaBars, FaChevronDown, FaChevronUp } from "react-icons/fa";
import Chatbot from "./Chatbot";
import { removeToken } from "../../auth/auth";

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [events, setEvents] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:3000/events");
      if (response.ok) {
        console.log("fetch success");
        const data = await response.json();
        setEvents(data);
      } else {
        console.error("Failed to fetch events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const filteredEvents = events
    .map((event) => {
      const eventDate = new Date(event.eventscheduleddate);
      const currentDate = new Date();
      if (eventDate < currentDate) {
        return { ...event, status: "completed" };
      }
      return { ...event, status: "upcoming" };
    })
    .filter((event) => {
      const eventDate = new Date(event.eventscheduleddate);
      const eventYear = eventDate.getFullYear();
      const eventMonth = eventDate.getMonth();
      if (selectedYear !== eventYear) {
        return false;
      }
      if (selectedMonth !== "all" && selectedMonth !== eventMonth.toString()) {
        return false;
      }
      return true;
    });

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const handleCreateEvent = () => {
    navigate("/admin/create-event");
  };

  const handleViewEventDetails = (eventId) => {
    navigate(`/admin/events/${eventId}/details`);
  };

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: 5 },
    (_, index) => currentYear - index
  );

  const monthOptions = [
    { value: "all", label: "All" },
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" },
  ];

  const StyledContainer = styled(Container)(({ theme }) => ({
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  }));

  const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    marginTop: theme.spacing(4),
  }));

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: "bold",
    color: theme.palette.text.primary,
  }));

  const StyledButton = styled(Button)(({ theme }) => ({
    marginRight: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.background.default,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  }));

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

  return (
    <>
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
          <StyledListItem button onClick={handleCreateEvent}>
            <ListItemText primary="Create Event" />
          </StyledListItem>
          <StyledListItem button onClick={handleLogout}>
            <ListItemText primary="Log Out" />
          </StyledListItem>
        </List>
      </StyledDrawer>

      <StyledContainer maxWidth="lg">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography variant="h4" component="h1">
            Admin Dashboard
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

        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              Analytics
            </Typography>
            <Box display="flex" justifyContent="space-around">
              <Zoom in={true}>
                <Paper
                  elevation={3}
                  style={{
                    padding: "16px",
                    backgroundColor: theme.palette.background.default,
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <Typography variant="h6" gutterBottom>
                      Upcoming Events
                    </Typography>
                    <IconButton
                      onClick={() => setIsCollapsed(!isCollapsed)}
                      size="small"
                    >
                      {isCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                    </IconButton>
                  </Box>
                  <Collapse in={!isCollapsed}>
                    <Box mt={2}>
                      <Select
                        value={selectedYear}
                        onChange={(e) =>
                          setSelectedYear(Number(e.target.value))
                        }
                        fullWidth
                      >
                        {yearOptions.map((year) => (
                          <MenuItem key={year} value={year}>
                            {year}
                          </MenuItem>
                        ))}
                      </Select>
                      <Select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        fullWidth
                      >
                        {monthOptions.map((month) => (
                          <MenuItem key={month.value} value={month.value}>
                            {month.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                  </Collapse>
                  <Typography variant="h4" align="center" color="primary">
                    {
                      filteredEvents.filter(
                        (event) => event.status === "upcoming"
                      ).length
                    }
                  </Typography>
                </Paper>
              </Zoom>
              <Zoom in={true} style={{ transitionDelay: "200ms" }}>
                <Paper
                  elevation={3}
                  style={{
                    padding: "16px",
                    backgroundColor: theme.palette.background.default,
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <Typography variant="h6" gutterBottom>
                      Completed Events
                    </Typography>
                    <IconButton
                      onClick={() => setIsCollapsed(!isCollapsed)}
                      size="small"
                    >
                      {isCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                    </IconButton>
                  </Box>
                  <Collapse in={!isCollapsed}>
                    <Box mt={2}>
                      <Select
                        value={selectedYear}
                        onChange={(e) =>
                          setSelectedYear(Number(e.target.value))
                        }
                        fullWidth
                      >
                        {yearOptions.map((year) => (
                          <MenuItem key={year} value={year}>
                            {year}
                          </MenuItem>
                        ))}
                      </Select>
                      <Select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        fullWidth
                      >
                        {monthOptions.map((month) => (
                          <MenuItem key={month.value} value={month.value}>
                            {month.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                  </Collapse>
                  <Typography variant="h4" align="center" color="primary">
                    {
                      filteredEvents.filter(
                        (event) => event.status === "completed"
                      ).length
                    }
                  </Typography>
                </Paper>
              </Zoom>
            </Box>
          </Box>
        </Slide>

        <Fade in={true}>
          <StyledTableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Event Name</StyledTableCell>
                  <StyledTableCell>Scheduled Date</StyledTableCell>
                  <StyledTableCell>Location</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell>Registration Form</StyledTableCell>
                  <StyledTableCell>Details</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event._id}>
                    <TableCell>{event.eventname}</TableCell>
                    <TableCell>{event.eventscheduleddate}</TableCell>
                    <TableCell>{event.eventvenue}</TableCell>
                    <TableCell>{event.status}</TableCell>
                    <TableCell>
                      <a
                        href={`http://localhost:3001/registration-form/${event._id}`}
                      >
                        Register
                      </a>
                    </TableCell>
                    <TableCell>
                      <StyledButton
                        variant="contained"
                        onClick={() => handleViewEventDetails(event._id)}
                      >
                        View Details
                      </StyledButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </Fade>
      </StyledContainer>

      <Chatbot />
    </>
  );
};

export default AdminDashboardPage;
