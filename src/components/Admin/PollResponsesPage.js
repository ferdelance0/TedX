import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Container, Typography, CircularProgress, Paper } from '@mui/material';
import { styled } from '@mui/system';
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
} from 'chart.js';

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
}));

const CustomCircularProgress = styled(CircularProgress)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
}));

const CustomChartContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: 400,
}));

const PollResponsesPage = () => {
  const { eventId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pollQuestions, setPollQuestions] = useState([]);
  const [cumulativeResponses, setCumulativeResponses] = useState({});

  useEffect(() => {
    const fetchPollQuestions = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/events/${eventId}/pollquestions`);
        const fetchedQuestions = response.data.pollQuestions;
        console.log('Fetched poll questions:', fetchedQuestions);
        setPollQuestions(fetchedQuestions);
      } catch (error) {
        console.error('Error fetching poll questions:', error);
        setError('Error fetching poll questions');
      }
    };

    const fetchPollResponses = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/events/${eventId}/pollresponses`);
        const pollResponses = response.data.pollResponses;
        setCumulativeResponses(pollResponses);
      } catch (error) {
        console.error('Error fetching poll responses:', error);
        setError('Error fetching poll responses');
      }
    };


    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchPollQuestions(), fetchPollResponses()]);
      setIsLoading(false);
    };

    fetchData();
  }, [eventId]);

const generatePieChartData = (question) => {
  const options = question.options;
  const counts = options.map((option) => cumulativeResponses[question._id]?.[option] || 0);
  const chartData = {
    labels: options,
    datasets: [
      {
        data: counts,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };
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
        Poll Responses
      </CustomTypography>
      {pollQuestions.map((question) => (
        <CustomPaper key={question._id}>
          <Typography variant="h6" gutterBottom>
            {question.question}
          </Typography>
          <CustomChartContainer>
            <Pie
              data={generatePieChartData(question)}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                height: '400px', // Adjust the height as needed
  width: '100%', // Adjust the width as needed
              }}
            />
          </CustomChartContainer>
        </CustomPaper>
      ))}
    </CustomContainer>
  );
};

export default PollResponsesPage;
