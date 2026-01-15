import React, { useEffect } from "react";
import { useParams, useNavigate,Link} from "react-router-dom";
import { ChevronLeft, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Flex, Portal, Select, Spacer, createListCollection,Container,Center } from "@chakra-ui/react"
import { motion } from "framer-motion";
import { useState } from "react";
import { fetchSubmissions } from "@/api/user";
import Loader from "@/components/Loader";

const ViewSubmissions = () => {
  const { assignmentid } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading,setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const decoded_id = decodeURIComponent(assignmentid.replace(/\s+/g, '-'));

  useEffect(() => {
    const getSubmissions = async () => {
      try {
        const sub = await fetchSubmissions(token,decoded_id);
        setSubmissions(sub.data);
      } catch (error) {
        console.log("Error fetching data, ", error);
      }
    }

    getSubmissions();
  },[token]);

  useEffect(()=>{
    if(submissions != undefined){
      setLoading(false);
    }
  })

  const handleNavigate = (id) => {
    navigate(`/SubmissionDetails/:${id}`);
  }


  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle size={16} color="#10B981" />;
      case "Pending":
        return <Clock size={16} color="#F59E0B" />;
      default:
        return <AlertCircle size={16} color="#EF4444" />;
    }
  };

  const [filt, setFilter] = useState("Completed");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={styles.container}
    >
      {/* Header */}
      <div style={styles.header}>
        <button
          onClick={() => navigate(-1)}
          style={styles.backButton}
        >
          <ChevronLeft size={20} />
          Back to Assignments
        </button>
        <Flex direction={'row'} color={'black'}>
          <h2 style={styles.title}>Submissions for: {submissions[0] == undefined ? "" : submissions[0].assignment.title}</h2>
          <Spacer />

          <Select.Root
            collection={frameworks}
            width="200px"
            value={filt}
            onValueChange={(e) => setFilter(e.value)}
          >
            <Select.HiddenSelect />
            <Select.Label>Filter</Select.Label>
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText
                  p={'10px'}
                  placeholder={filt} />
              </Select.Trigger>
              <Select.IndicatorGroup pr={'5px'}>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content
                  p={'10px'}
                >
                  {frameworks.items.map((framework) => (
                    <Select.Item item={framework} key={framework.value}>
                      {framework.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        </Flex>
      </div>



      {/* Table */}
      {loading ? <Container fluid p={'100px'} alignContent={'center'}>
      <Center><Loader /></Center>
    </Container>:
      <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeader}>
            <th style={styles.th}>Student Name</th>
            <th style={styles.th}>Branch</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Submitted On</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filt == "pending" ?
           submissions.filter((ob)=>{
            return ob.status == false
           }).map((assignment) => (
            <tr key={assignment._id} style={styles.tableRow}>
              <td style={styles.td}>{assignment.student.name}</td>
              <td style={styles.td}>{assignment.student.department}</td>
              <td style={styles.td}>
                <div style={styles.statusCell}>
                  {getStatusIcon("Pending")}
                  <span>Completed</span>
                </div>
              </td>
              <td style={styles.td}>NA</td>
              <td style={styles.td}>
                <button
                  style={styles.viewButton}
                  onClick={() => handleNavigate(assignment._id)}

                >
                  View
                </button>
              </td>
            </tr>
          ))
           :
           submissions.filter((ob)=>{
            return ob.status == true
           }).map((assignment) => (
            <tr key={assignment._id} style={styles.tableRow}>
              <td style={styles.td}>{assignment.student.name}</td>
              <td style={styles.td}>{assignment.student.department}</td>
              <td style={styles.td}>
                <div style={styles.statusCell}>
                  {getStatusIcon("Completed")}
                  <span>Completed</span>
                </div>
              </td>
              <td style={styles.td}>{assignment.updatedAt.substring(0,10)}</td>
              <td style={styles.td}>
                <button
                  style={styles.viewButton}
                   onClick={() => handleNavigate(assignment._id)}
                >
                  View
                </button>
              </td>
            </tr>
          ))
          }
        </tbody>
      </table>
    </div>
      }
    </motion.div>
  );
};

const frameworks = createListCollection({
  items: [
    { label: "Completed", value: "done" },
    { label: "Pending", value: "pending" },
  ],
})

const styles = {
  container: {
    padding: "32px",
    backgroundColor: "#f3f4f6",
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif"
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginBottom: "24px"
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "transparent",
    border: "none",
    color: "#4b5563",
    cursor: "pointer",
    fontSize: "14px",
    padding: "8px 0"
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#111827",
    margin: 0
  },
  tableContainer: {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
    overflow: "hidden"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse"
  },
  tableHeader: {
    backgroundColor: "#f9fafb",
    borderBottom: "1px solid #e5e7eb"
  },
  th: {
    padding: "16px 24px",
    textAlign: "left",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151"
  },
  tableRow: {
    borderBottom: "1px solid #e5e7eb",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#f9fafb"
    }
  },
  td: {
    padding: "16px 24px",
    fontSize: "14px",
    color: "#4b5563"
  },
  statusCell: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  viewButton: {
    backgroundColor: "#4F46E5",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#4338CA"
    }
  }
};

export default ViewSubmissions;

