import axios from "axios";

// Base backend URL from .env
const API_URL = "https://codecampus-2ypn.onrender.com/api";

export const fetchUserData = async (token) => {
  try {
    const res = await axios.get(`${API_URL}/user`, {
      headers: {
        Authorization: token,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching user data ", error);
    throw error;
  }
};

export const addAssignment = async (assData, token) => {
  try {
    const res = await axios.post(`${API_URL}/addAssignment`, assData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    return res;
  } catch (error) {
    console.error("Error adding assignment ", error);
    throw error;
  }
};

export const fetchAssignment = async (token) => {
  try {
    const res = await axios.get(`${API_URL}/fetchAssignment`, {
      headers: {
        Authorization: token,
      },
    });
    return res;
  } catch (error) {
    console.error("Error fetching assignments: ", error);
    throw error;
  }
};

export const fetchPersonalDetails = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/personalInfo`, {
      params: { id },
    });
    return res;
  } catch (error) {
    console.error("Error fetching details ", error);
    throw error;
  }
};

export const fetchBothAssignments = async (token) => {
  try {
    const res = await axios.get(
      `${API_URL}/pending_completed_Assignments`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return res;
  } catch (error) {
    console.error("Error fetching assignments: ", error);
    throw error;
  }
};

export const fetchSubmissions = async (token, assignment_id) => {
  try {
    const res = await axios.get(`${API_URL}/fetchSubmissions`, {
      headers: {
        Authorization: token,
      },
      params: {
        id: assignment_id,
      },
    });
    return res;
  } catch (error) {
    console.error("Error fetching details ", error);
    throw error;
  }
};

export const getSubmission = async (token, submissionId) => {
  try {
    const res = await axios.get(`${API_URL}/getSubmission`, {
      headers: {
        Authorization: token,
      },
      params: {
        id: submissionId,
      },
    });
    return res;
  } catch (error) {
    console.error("Error fetching assignments: ", error);
    throw error;
  }
};

export const updateLock = async (token, data) => {
  try {
    const res = await axios.post(`${API_URL}/updateLock`, data, {
      headers: {
        Authorization: token,
      },
    });
    return res;
  } catch (error) {
    console.error("Error updating lock: ", error);
    throw error;
  }
};

export const submitAssignment = async (token, data) => {
  try {
    const res = await axios.post(`${API_URL}/submitAssignment`, data, {
      headers: {
        Authorization: token,
      },
    });
    return res;
  } catch (error) {
    console.error("Error submitting assignment: ", error);
    throw error;
  }
};
