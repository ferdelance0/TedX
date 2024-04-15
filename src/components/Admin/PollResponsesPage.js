import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PollResponsesPage = () => {
  const { eventId } = useParams();
  const [pollResponses, setPollResponses] = useState([]);

  useEffect(() => {
    const fetchPollResponses = async () => {
      try {
        const response = await axios.get(`/events/${eventId}/pollresponses`);
        setPollResponses(response.data.pollResponses);
      } catch (error) {
        console.error('Error fetching poll responses:', error);
      }
    };

    fetchPollResponses();
  }, [eventId]);

  return (
    <div>
      <h2>Poll Responses</h2>
      {pollResponses.length === 0 ? (
        <p>No poll responses available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              {/* <th>Participant ID</th> */}
              <th>Responses</th>
            </tr>
          </thead>
          <tbody>
            {pollResponses.map((response) => (
              <tr key={response._id}>
                {/* <td>{response.participantId}</td> */}
                <td>{response.responses.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PollResponsesPage;
