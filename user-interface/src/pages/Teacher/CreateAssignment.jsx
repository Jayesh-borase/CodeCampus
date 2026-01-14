import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showToast } from "../Editor/showToaster";
import { ArrowLeft, Calendar, ChevronDown } from 'lucide-react';
import { addAssignment, fetchUserData } from '@/api/user';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CreateAssignment = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [startDate, setStartDate] = useState(new Date());
  const [isDateValid, setIsDateValid] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due: '',
    maxMarks: 100,
    constraints: '',
    example: '',
    language: 'javascript'
  });

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'c', label: 'C' },
    { value: 'cpp', label: 'C++' },
  ];

  const handleDateChange = (date) => {
    setStartDate(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isValid = date >= today;
    setIsDateValid(isValid);
    
    if (isValid) {
      const formattedDate = date.toISOString().split('T')[0];
      setFormData({...formData, due: formattedDate});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isDateValid) {
      showToast("Invalid", "Date must be today or in future!", "error");
      return;
    }

    try {
      const teacher = await fetchUserData(token);
      await addAssignment({
        assignor: teacher._id,
        teacher: teacher.name,
        title: formData.title,
        description: formData.description,
        constraints: formData.constraints,
        example: formData.example,
        language: formData.language,
        due: formData.due,
        maxMarks: formData.maxMarks
      }, token);
      
      showToast("Success", "Assignment added successfully!", "success");
      setTimeout(() => navigate('/teacher'), 1500);
    } catch (error) {
      console.log("Error: ", error);
      showToast("Error", "Something went wrong!", "error");
    }
  };

  return (
    <div style={styles.container}>
      
      <motion.button
        style={styles.backButton}
        onClick={() => navigate('/teacher')}
        whileHover={{ scale: 1.05 }}
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </motion.button>

      <h1 style={styles.header}>Create New Assignment</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Assignment Title*</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            style={styles.input}
            placeholder="Enter assignment title"
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Problem Statement*</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            style={{...styles.input, minHeight: '120px'}}
            placeholder="Provide detailed instructions"
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Constraints</label>
          <textarea
            value={formData.constraints}
            onChange={(e) => setFormData({...formData, constraints: e.target.value})}
            style={{...styles.input, minHeight: '80px'}}
            placeholder="Add any constraints or requirements"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Example</label>
          <textarea
            value={formData.example}
            onChange={(e) => setFormData({...formData, example: e.target.value})}
            style={{...styles.input, minHeight: '100px', fontFamily: "'Courier New', monospace"}}
            placeholder="Provide example input/output"
          />
        </div>

        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Programming Language*</label>
            <div style={styles.selectContainer}>
              <select
                value={formData.language}
                onChange={(e) => setFormData({...formData, language: e.target.value})}
                style={styles.select}
                required
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={18} style={styles.selectIcon} />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Max Marks</label>
            <input
              type="number"
              value={formData.maxMarks}
              onChange={(e) => setFormData({...formData, maxMarks: e.target.value})}
              style={styles.input}
              min="1"
              placeholder="100"
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Due Date*</label>
          <div style={styles.datePickerContainer}>
            <Calendar size={18} style={styles.dateIcon} />
            <DatePicker
              selected={startDate}
              onChange={handleDateChange}
              minDate={new Date()}
              dateFormat="MMMM d, yyyy"
              placeholderText="Select due date"
              className="date-picker-input"
              wrapperClassName="date-picker-wrapper"
              required
            />
          </div>
          {!isDateValid && (
            <p style={styles.errorText}>Due date must be today or in the future</p>
          )}
        </div>

        <motion.button
          type="submit"
          style={styles.submitButton}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!isDateValid}
        >
          Create Assignment
        </motion.button>
      </form>

      <style jsx global>{`
        .date-picker-wrapper {
          width: 100%;
        }
        .date-picker-input {
          width: 100%;
          padding: 12px 12px 12px 40px;
          border-radius: 8px;
          border: 1px solid #E5E7EB;
          font-size: 14px;
          background-color: #F9FAFB;
          color: black;
        }
        .react-datepicker {
          font-family: 'Inter', sans-serif;
          border: 1px solid #E5E7EB;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .react-datepicker__header {
          background-color: #F9FAFB;
          border-bottom: 1px solid #E5E7EB;
        }
        .react-datepicker__current-month,
        .react-datepicker__day-name {
          color: #374151;
          font-weight: 500;
        }
        .react-datepicker__day--selected {
          background-color: #4F46E5;
        }
        .react-datepicker__day--keyboard-selected {
          background-color: #4F46E5;
        }
      `}</style>
      <ToastContainer />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: '40px',
    fontFamily: "'Inter', sans-serif",
    backgroundColor: '#f3f4f6',
    minHeight: '100vh'
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#4F46E5',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '30px',
    width: 'fit-content'
  },
  header: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '30px'
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    maxWidth: '800px',
    margin: '0 auto',
    width: '100%'
  },
  formGroup: {
    marginBottom: '20px',
    position: 'relative'
  },
  formRow: {
    display: 'flex',
    gap: '20px',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: '20px'
    }
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151'
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #E5E7EB',
    fontSize: '14px',
    backgroundColor: '#F9FAFB',
    color: "black",
    '&:focus': {
      outline: 'none',
      borderColor: '#4F46E5'
    },
  },
  selectContainer: {
    position: 'relative'
  },
  select: {
    width: '100%',
    padding: '12px 40px 12px 12px',
    borderRadius: '8px',
    border: '1px solid #E5E7EB',
    fontSize: '14px',
    backgroundColor: '#F9FAFB',
    color: "black",
    appearance: 'none',
    '&:focus': {
      outline: 'none',
      borderColor: '#4F46E5'
    },
  },
  selectIcon: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#6B7280',
    pointerEvents: 'none'
  },
  datePickerContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  dateIcon: {
    position: 'absolute',
    left: '12px',
    color: '#6B7280',
    zIndex: 1
  },
  submitButton: {
    backgroundColor: '#4F46E5',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    marginTop: '20px',
    width: '100%',
    '&:disabled': {
      backgroundColor: '#9CA3AF',
      cursor: 'not-allowed'
    }
  },
  errorText: {
    color: '#EF4444',
    fontSize: '12px',
    marginTop: '4px'
  }
};

export default CreateAssignment;