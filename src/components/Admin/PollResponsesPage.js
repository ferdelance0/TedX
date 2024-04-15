import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const PollResponsesPage = () => {
  const { eventId } = useParams();
  const [pollResponses, setPollResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pollQuestions, setPollQuestions] = useState([]);

  // Fetch poll questions for the event
  useEffect(() => {
    const fetchPollQuestions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/events/${eventId}/pollquestions`
        );
        setPollQuestions(response.data.pollQuestions);
      } catch (error) {
        console.error('Error fetching poll questions:', error);
      }
    };

    fetchPollQuestions();
  }, [eventId]);

  // Fetch poll responses for the event
  useEffect(() => {
    const fetchPollResponses = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get(
          `http://localhost:3000/events/${eventId}/pollresponses`
        );
        setPollResponses(response.data.pollResponses);
      } catch (error) {
        setError('Error fetching poll responses');
        console.error('Error fetching poll responses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPollResponses();
  }, [eventId]);

  // Function to generate pie chart data
  const generatePieChartData = (question, responses) => {
    const options = question.options;
    const counts = options.map(() => 0);

    responses.forEach((response) => {
      const selectedOption = response.responses.find(
        (optionIndex) =>
          optionIndex === question.options.indexOf(options[optionIndex])
      );
      if (selectedOption !== undefined) {
        counts[selectedOption] += 1;
      }
    });

    const chartData = {
      labels: options,
      datasets: [
        {
          data: counts,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
          ],
        },
      ],
    };

    return chartData;
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Poll Responses</h2>
      {pollQuestions.map((question, index) => (
        <div key={index}>
          <h3>{question.question}</h3>
          <Pie
            data={generatePieChartData(question, pollResponses)}
            options={
              {
                //responsive: true,
                //maintainAspectRatio: false,
                // plugins: {
                //   legend: {
                //     position: 'bottom',
                //   },
                // },
              }
            }
            height={50} // Adjust the desired height here
            width={50} // Adjust the desired width here
          />
        </div>
      ))}
    </div>
  );
};

export default PollResponsesPage;
