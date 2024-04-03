import React from 'react';
import { Card, Button } from '@shadcn/ui';

const EventCard = ({ event, onStatusChange }) => {
  const handleStatusChange = (newStatus) => {
    onStatusChange(event.id, newStatus);
  };

  return (
    <Card className="mb-4">
      <h3>{event.name}</h3>
      <p>{event.location}</p>
      <div className="mt-4">
        <Button onClick={() => handleStatusChange('upcoming')}>Upcoming</Button>
        <Button onClick={() => handleStatusChange('active')}>Active</Button>
        <Button onClick={() => handleStatusChange('completed')}>
          Completed
        </Button>
      </div>
    </Card>
  );
};

export default EventCard;
