// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import ProgressBar from "../Admin/ProgressBar";
// import {
//   Container,
//   Typography,
//   TextField,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Grid,
//   Box,
//   Slide,
//   Zoom,
//   Fade,
//   Checkbox,
//   FormControlLabel,
//   Card,
//   CardContent,
//   CardActions,
// } from "@mui/material";
// import { styled } from "@mui/system";

// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

// const StyledContainer = styled(Container)(({ theme }) => ({
//   marginTop: theme.spacing(4),
//   marginBottom: theme.spacing(4),
// }));

// const StyledForm = styled("form")(({ theme }) => ({
//   marginTop: theme.spacing(2),
// }));

// const StyledTextField = styled(TextField)(({ theme }) => ({
//   marginBottom: theme.spacing(2),
// }));

// const StyledButton = styled(Button)(({ theme }) => ({
//   marginTop: theme.spacing(2),
// }));

// const RegistrationForm = () => {
//   const { eventId } = useParams();
//   const [eventExists, setEventExists] = useState(false);
//   const [eventName, setEventName] = useState("");
//   const [eventDetails, setEventDetails] = useState("");
//   const [eventDate, setEventDate] = useState("");
//   const [registrationFields, setRegistrationFields] = useState([]);
//   const [participantData, setParticipantData] = useState({});
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [subevents, setSubevents] = useState([]);
//   const [selectedSubevents, setSelectedSubevents] = useState([]);
//   const [subeventError, setSubeventError] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1); // Add current pa
//   useEffect(() => {
//     axios
//       .get(`http://localhost:3000/events/${eventId}`)
//       .then((response) => {
//         if (response.data.event) {
//           setEventExists(true);
//           setEventName(response.data.event.eventname);
//           setEventDetails(response.data.event.eventdetails);
//           setEventDate(response.data.event.eventdate);
//           setRegistrationFields(response.data.event.eventregistrationfields);
//           setParticipantData({ eventId });
//         } else {
//           return <div>Event not found.</div>;
//         }
//       })
//       .catch((error) => {
//         console.error("Error checking event existence:", error);
//       });

//     // Fetch subevents for the current event
//     axios
//       .get(`http://localhost:3000/api/subevents/${eventId}`)
//       .then((response) => {
//         setSubevents(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching subevents:", error);
//       });
//   }, [eventId]);

//   const handleInputChange = (field, value) => {
//     setParticipantData((prevData) => ({
//       ...prevData,
//       [field]: value,
//     }));
//   };
//   const handleNextPage = () => {
//     setCurrentPage(currentPage + 1);
//   };

//   const handlePrevPage = () => {
//     setCurrentPage(currentPage - 1);
//   };

//   const handleSubeventChange = (subevent) => {
//     const { _id, subeventname } = subevent;
//     const selectedIndex = selectedSubevents.findIndex(
//       (se) => se.subeventId === _id
//     );
//     let newSelectedSubevents = [...selectedSubevents];

//     if (selectedIndex === -1) {
//       newSelectedSubevents.push({
//         subeventId: _id,
//         subeventName: subeventname,
//       });
//     } else {
//       newSelectedSubevents.splice(selectedIndex, 1);
//     }

//     setSelectedSubevents(newSelectedSubevents);
//     setSubeventError(newSelectedSubevents.length === 0 && subevents.length > 0);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (subevents.length > 0 && selectedSubevents.length === 0) {
//       setSubeventError(true);
//       return;
//     }

//     axios
//       .post("http://localhost:3000/createParticipantModel", {
//         eventId,
//         registrationFields,
//       })
//       .then(() => {
//         axios
//           .post("http://localhost:3000/registerParticipant", {
//             eventId,
//             registrationFields,
//             participantData,
//             selectedSubevents,
//           })
//           .then((response) => {
//             console.log("Participant registered:", response.data.participant);
//             setShowSuccessModal(true);
//           })
//           .catch((error) => {
//             console.error("Error registering participant:", error);
//           });
//       })
//       .catch((error) => {
//         console.error("Error creating participant model:", error);
//       });
//   };

//   return (
//     <StyledContainer maxWidth="sm">
//       <Fade in={true}>
//         <Box>
//         <Box mb={4}>
//             <Typography variant="h4" align="center" gutterBottom>
//               {eventName}
//             </Typography>
//             <Typography variant="body1" align="center" gutterBottom>
//               {eventDetails}
//             </Typography>
//             <Typography variant="body2" align="center" gutterBottom>
//               Event Date: {eventDate}
//             </Typography>
//           </Box>
//           <Typography variant="h4" align="center" gutterBottom>
//             Registration Form
//           </Typography>

//           {/* Add the ProgressBar component */}
//           <ProgressBar currentPage={currentPage} totalPages={2} />

//           <StyledForm onSubmit={handleSubmit}>
//             {currentPage === 1 ? (
//               // Participant Information Page
//               <Grid container spacing={2}>
//                 {registrationFields.map((field) => (
//                   <Grid item xs={12} key={field.label}>
//                     <Zoom in={true}>
//                       <StyledTextField
//                         label={field.label}
//                         type={field.inputType}
//                         name={field.label}
//                         value={participantData[field.label] || ""}
//                         onChange={(e) =>
//                           handleInputChange(field.label, e.target.value)
//                         }
//                         fullWidth
//                         required
//                       />
//                     </Zoom>
//                   </Grid>
//                 ))}
//                 <Grid item xs={12} display="flex" justifyContent="space-between">
//                   <div></div>
//                   <StyledButton
//                     variant="contained"
//                     color="primary"
//                     onClick={handleNextPage}
//                   >
//                     Next
//                   </StyledButton>
//                 </Grid>
//               </Grid>
//             ) : (
//               // Subevents Page
//               <Box mt={2}>
//                 <Typography variant="h6" align="center" gutterBottom>
//                   Select Subevents (at least one is required)
//                 </Typography>
//                 {subevents.map((subevent) => (
//                   <Card key={subevent._id} variant="outlined" sx={{ mb: 2 }}>
//                     <CardContent>
//                       <Typography variant="h6" component="div">
//                         {subevent.subeventname}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         {subevent.subeventdescription}
//                       </Typography>
//                       <Typography variant="body2" mt={1}>
//                         Organizer: {subevent.subeventorganizer}
//                       </Typography>
//                     </CardContent>
//                     <CardActions>
//                       <FormControlLabel
//                         control={
//                           <Checkbox
//                             checked={selectedSubevents.some(
//                               (se) => se.subeventId === subevent._id
//                             )}
//                             onChange={() => handleSubeventChange(subevent)}
//                           />
//                         }
//                         label="Register"
//                       />
//                     </CardActions>
//                   </Card>
//                 ))}
//                 {subeventError && (
//                   <Typography variant="caption" color="error">
//                     Please select at least one subevent.
//                   </Typography>
//                 )}
//                 <Box display="flex" justifyContent="space-between" mt={2}>
//                   <StyledButton
//                     variant="contained"
//                     color="primary"
//                     onClick={handlePrevPage}
//                   >
//                     Previous
//                   </StyledButton>
//                   <StyledButton type="submit" variant="contained" color="primary">
//                     Submit
//                   </StyledButton>
//                 </Box>
//               </Box>
//             )}
//           </StyledForm>
//         </Box>
//       </Fade>

//       <Dialog
//         open={showSuccessModal}
//         onClose={() => setShowSuccessModal(false)}
//         TransitionComponent={Transition}
//       >
//         <DialogTitle>Success!</DialogTitle>
//         <DialogContent>
//           <Typography>You have been registered for this event!</Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button
//             onClick={() => {
//               setShowSuccessModal(false);
//               // Optionally, you can redirect to the dashboard or perform any other action
//             }}
//             color="primary"
//           >
//             OK
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </StyledContainer>
//   );
// };

// export default RegistrationForm;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ProgressBar from "../Admin/ProgressBar";
import {
  Container,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Box,
  Slide,
  Zoom,
  Fade,
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { styled } from "@mui/system";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const StyledForm = styled("form")(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const RegistrationForm = () => {
  const { eventId } = useParams();
  const [eventExists, setEventExists] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventDetails, setEventDetails] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [registrationFields, setRegistrationFields] = useState([]);
  const [participantData, setParticipantData] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [subevents, setSubevents] = useState([]);
  const [selectedSubevents, setSelectedSubevents] = useState([]);
  const [subeventError, setSubeventError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [allFieldsEntered, setAllFieldsEntered] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/events/${eventId}`)
      .then((response) => {
        if (response.data.event) {
          setEventExists(true);
          setEventName(response.data.event.eventname);
          setEventDetails(response.data.event.eventdetails);
          setEventDate(response.data.event.eventdate);
          setRegistrationFields(response.data.event.eventregistrationfields);
          setParticipantData({ eventId });
        } else {
          return <div>Event not found.</div>;
        }
      })
      .catch((error) => {
        console.error("Error checking event existence:", error);
      });

    // Fetch subevents for the current event
    axios
      .get(`http://localhost:3000/api/subevents/${eventId}`)
      .then((response) => {
        setSubevents(response.data);
        console.log("Fetched subevents:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching subevents:", error);
      });
  }, [eventId]);

  const handleInputChange = (field, value) => {
    setParticipantData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const validatePhoneNumber = (phoneNumber) => {
    console.log(phoneNumber);
    // Check if phoneNumber is defined
    if (typeof phoneNumber === "string") {
      // Remove any non-numeric characters from the phone number

      // Check if the numeric phone number is exactly 10 digits long
      if (phoneNumber.length === 10) {
        console.log("10 digits long");
        return true;
      }
    } else {
      console.log("not 10 digits");
      return false;
    }
  };

  const validateFieldsEntered = () => {
    for (const field of registrationFields) {
      if (!participantData[field.label]) {
        return false;
      }
    }
    return true;
  };

  const handleNextPage = () => {
    if (currentPage === 1) {
      // Validate phone number and fields entered before proceeding
      const phoneNumberValid = validatePhoneNumber(participantData.Phone);
      const fieldsEntered = validateFieldsEntered();

      setPhoneNumberError(!phoneNumberValid);
      setAllFieldsEntered(!fieldsEntered);

      if (phoneNumberValid && fieldsEntered) {
        setCurrentPage(currentPage + 1);
      }
    }
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleSubeventChange = (subevent) => {
    console.log("handleSubeventChange called");
    console.log("subevent:", subevent);
    const { _id, subeventname } = subevent;
    const selectedIndex = selectedSubevents.findIndex(
      (se) => se.subeventId === _id
    );
    let newSelectedSubevents = [...selectedSubevents];

    if (selectedIndex === -1) {
      newSelectedSubevents.push({
        subeventId: _id,
        subeventName: subeventname,
      });
    } else {
      newSelectedSubevents.splice(selectedIndex, 1);
    }

    setSelectedSubevents(newSelectedSubevents);
    console.log("Updated selectedSubevents:", newSelectedSubevents);
    setSubeventError(newSelectedSubevents.length === 0 && subevents.length > 0);
  };

  const handleSubmit = (e) => {
    console.log("handleSubmit called" + selectedSubevents);
    console.log(selectedSubevents);
    e.preventDefault();

    if (subevents.length > 0 && selectedSubevents.length === 0) {
      setSubeventError(true);
      return;
    }

    axios
      .post("http://localhost:3000/createParticipantModel", {
        eventId,
        registrationFields,
      })
      .then(() => {
        axios
          .post("http://localhost:3000/registerParticipant", {
            eventId,
            registrationFields,
            participantData,
            selectedSubevents,
          })
          .then((response) => {
            console.log("Participant registered:", response.data.participant);
            setShowSuccessModal(true);
          })
          .catch((error) => {
            console.error("Error registering participant:", error);
          });
      })
      .catch((error) => {
        console.error("Error creating participant model:", error);
      });
  };

  return (
    <StyledContainer maxWidth="sm">
      <Fade in={true}>
        <Box>
          <Box mb={4}>
            <Typography variant="h4" align="center" gutterBottom>
              {eventName}
            </Typography>
            <Typography variant="body1" align="center" gutterBottom>
              {eventDetails}
            </Typography>
            <Typography variant="body2" align="center" gutterBottom>
              Event Date: {eventDate}
            </Typography>
          </Box>
          <Typography variant="h4" align="center" gutterBottom>
            Registration Form
          </Typography>

          {/* Add the ProgressBar component */}
          <ProgressBar currentPage={currentPage} totalPages={2} />

          <StyledForm onSubmit={handleSubmit}>
            {currentPage === 1 ? (
              // Participant Information Page
              <Grid container spacing={2}>
                {registrationFields.map((field) => (
                  <Grid item xs={12} key={field.label}>
                    <Zoom in={true}>
                      <StyledTextField
                        label={field.label}
                        type={field.inputType}
                        name={field.label}
                        value={participantData[field.label] || ""}
                        onChange={(e) =>
                          handleInputChange(field.label, e.target.value)
                        }
                        fullWidth
                        required
                      />
                    </Zoom>
                  </Grid>
                ))}
                <Grid
                  item
                  xs={12}
                  display="flex"
                  justifyContent="space-between"
                >
                  <div>
                    {phoneNumberError && (
                      <Typography variant="caption" color="error">
                        Please enter a valid 10-digit phone number.
                      </Typography>
                    )}
                    {allFieldsEntered && (
                      <Typography variant="caption" color="error">
                        Please fill in all fields.
                      </Typography>
                    )}
                  </div>
                  <StyledButton
                    variant="contained"
                    color="primary"
                    onClick={handleNextPage}
                  >
                    Next
                  </StyledButton>
                </Grid>
              </Grid>
            ) : (
              // Subevents Page
              <Box mt={2}>
                <Typography variant="h6" align="center" gutterBottom>
                  Select Subevents (at least one is required)
                </Typography>
                {subevents.map((subevent) => (
                  <Card key={subevent._id} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6" component="div">
                        {subevent.subeventname}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {subevent.subeventdescription}
                      </Typography>
                      <Typography variant="body2" mt={1}>
                        Organizer: {subevent.subeventorganizer}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedSubevents.some(
                              (se) => se.subeventId === subevent._id
                            )}
                            onChange={() => handleSubeventChange(subevent)}
                          />
                        }
                        label="Register"
                      />
                    </CardActions>
                  </Card>
                ))}
                {subeventError && (
                  <Typography variant="caption" color="error">
                    Please select at least one subevent.
                  </Typography>
                )}
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <StyledButton
                    variant="contained"
                    color="primary"
                    onClick={handlePrevPage}
                  >
                    Previous
                  </StyledButton>
                  <StyledButton
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Submit
                  </StyledButton>
                </Box>
              </Box>
            )}
          </StyledForm>
        </Box>
      </Fade>

      <Dialog
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        TransitionComponent={Transition}
      >
        <DialogTitle>Success!</DialogTitle>
        <DialogContent>
          <Typography>You have been registered for this event!</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowSuccessModal(false);
              // Optionally, you can redirect to the dashboard or perform any other action
            }}
            color="primary"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  );
};

export default RegistrationForm;
