// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const RegistrationForm = () => {
//   const [fields, setFields] = useState([]);

//   useEffect(() => {
//     // Fetch the fields from the database when the component mounts
//     fetchFields();
//   }, []);

//   const fetchFields = async () => {
//     try {
//       const response = await axios.get('/api/fields');
//       setFields(response.data);
//     } catch (error) {
//       console.error('Error fetching fields:', error);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const data = Object.fromEntries(formData.entries());

//     try {
//       await axios.post('/api/register', data);
//       // Handle successful form submission
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       // Handle form submission error
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       {fields.map((field) => (
//         <div key={field.label}>
//           <label>{field.label}</label>
//           {field.inputType === 'text' && (
//             <input type="text" name={field.label} required />
//           )}
//           {field.inputType === 'number' && (
//             <input type="number" name={field.label} required />
//           )}
//           {field.inputType === 'email' && (
//             <input type="email" name={field.label} required />
//           )}
//           {field.inputType === 'date' && (
//             <input type="date" name={field.label} required />
//           )}
//           {field.inputType === 'file' && (
//             <input type="file" name={field.label} required />
//           )}
//           {/* Add more input types as needed */}
//         </div>
//       ))}
//       <button type="submit">Submit</button>
//     </form>
//   );
// };

// export default RegistrationForm;

import React from 'react';

const RegistrationForm = () => {
  const fieldsData = [
    { label: 'Name', inputType: 'text' },
    { label: 'Email', inputType: 'email' },
    { label: 'Phone', inputType: 'number' },
    { label: 'Date of Birth', inputType: 'date' },
    { label: 'Resume', inputType: 'file' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    console.log('Form data:', data);
    // Handle form submission (e.g., send data to server)
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {fieldsData.map((field) => (
          <div key={field.label}>
            <label>{field.label}</label>
            {field.inputType === 'text' && (
              <input type="text" name={field.label} required />
            )}
            {field.inputType === 'number' && (
              <input type="number" name={field.label} required />
            )}
            {field.inputType === 'email' && (
              <input type="email" name={field.label} required />
            )}
            {field.inputType === 'date' && (
              <input type="date" name={field.label} required />
            )}
            {field.inputType === 'file' && (
              <input type="file" name={field.label} required />
            )}
            {/* Add more input types as needed */}
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default RegistrationForm;
