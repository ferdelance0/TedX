import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import {
  Container,
  Typography,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/system";
import {
  Chart,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const CustomContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const CustomTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const CustomPaper = styled(Paper)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  padding: theme.spacing(2),
  backgroundColor: "#f5f5f5",
}));

const CustomCircularProgress = styled(CircularProgress)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
}));

const CustomChartContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: 300,
  width: "100%",
}));

const PollResponsesPage = () => {
  const { eventId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pollQuestions, setPollQuestions] = useState([]);
  const [participantResponses, setParticipantResponses] = useState([]);

  useEffect(() => {
    const fetchPollQuestions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/events/${eventId}/pollquestions`
        );
        const fetchedQuestions = response.data.pollQuestions;
        console.log("Fetched poll questions:", fetchedQuestions);
        setPollQuestions(fetchedQuestions);
      } catch (error) {
        console.error("Error fetching poll questions:", error);
        setError("Error fetching poll questions");
      }
    };

    const fetchPollResponses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/events/${eventId}/pollresponses`
        );
        const participantResponses = response.data.participantResponses || [];
        console.log("Participant Responses:", participantResponses);
        setParticipantResponses(participantResponses);
      } catch (error) {
        console.error("Error fetching poll responses:", error);
        setError("Error fetching poll responses");
      }
    };

    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchPollQuestions(), fetchPollResponses()]);
      setIsLoading(false);
    };

    fetchData();
  }, [eventId]);

  const generatePieChartData = (question, questionIndex) => {
    const options = question.options;
    const counts = options.reduce((acc, option) => {
      const optionCount = participantResponses.reduce((count, participant) => {
        const response = participant.pollResponses[questionIndex];
        return response && response.answer === option ? count + 1 : count;
      }, 0);
      acc[option] = optionCount;
      return acc;
    }, {});

    const totalResponses = Object.values(counts).reduce(
      (sum, count) => sum + count,
      0
    );

    const chartData = {
      labels: options.map(
        (option) =>
          `${option} (${((counts[option] / totalResponses) * 100).toFixed(1)}%)`
      ),
      datasets: [
        {
          data: Object.values(counts),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
          ],
        },
      ],
    };
    console.log("Chart Data:", chartData);
    return chartData;
  };

  if (isLoading) {
    return <CustomCircularProgress />;
  }

  if (error) {
    return (
      <CustomContainer>
        <CustomTypography variant="h5">{error}</CustomTypography>
      </CustomContainer>
    );
  }

  return (
    <CustomContainer maxWidth="lg">
      <CustomTypography variant="h4" align="center" gutterBottom>
        Poll Responses Dashboard
      </CustomTypography>
      {pollQuestions.map((question, questionIndex) => (
        <CustomPaper key={`question-${questionIndex}`}>
          <Typography variant="h6" gutterBottom>
            {question.question}
          </Typography>
          <CustomChartContainer>
            <Pie
              key={`chart-${questionIndex}`}
              data={generatePieChartData(question, questionIndex)}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                height: "300px",
                width: "100%",
              }}
            />
          </CustomChartContainer>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>View Participant Responses</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Participant</TableCell>
                      <TableCell>Response</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {participantResponses.map(
                      (participant, participantIndex) => {
                        const participantResponse =
                          participant.pollResponses[questionIndex];
                        console.log(
                          "Participant Response in table:",
                          participantResponse
                        );
                        return (
                          <TableRow key={`participant-${participantIndex}`}>
                            <TableCell>{participant.name}</TableCell>
                            <TableCell>
                              {participantResponse?.answer || "-"}
                            </TableCell>
                          </TableRow>
                        );
                      }
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        </CustomPaper>
      ))}
    </CustomContainer>
  );
};

export default PollResponsesPage;
