
import React, { useState, useEffect } from 'react';
import Header from "../../components/Admin/Header";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Chip
} from '@mui/material';
import { Download as DownloadIcon, Visibility as ViewIcon } from '@mui/icons-material';
import 'react-calendar/dist/Calendar.css';

const API = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

const CoordinatorReports = () => {
  const [date, setDate] = useState(new Date());
  const eventDates = [new Date(2025, 5, 25), new Date(2025, 5, 30)];
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedReport, setSelectedReport] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch reports from backend
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API}/api/coordinator-reports`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setReports(Array.isArray(data) ? data : []);
          setFilteredReports(Array.isArray(data) ? data : []);
        } else {
          console.error('Failed to fetch reports:', response.status);
          setReports([]);
          setFilteredReports([]);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
        setReports([]);
        setFilteredReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Filter reports based on search query
  useEffect(() => {
    const filtered = reports.filter(report =>
      (report.title?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (report.university_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (report.summary?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (report.original_filename?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredReports(filtered);
    setPage(0);
  }, [searchQuery, reports]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedReport(null);
  };

  const handleDownloadReport = (report) => {
    // Download file from backend
    window.location.href = `${API}/api/coordinator-reports/download/${report._id}`;
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const getMonthYear = (month, year) => {
    if (!month || !year) return 'N/A';
    return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
  };

  const columns = [
    { id: 'university_name', label: 'University', minWidth: 150 },
    { id: 'title', label: 'Report Title', minWidth: 200 },
    { id: 'monthYear', label: 'Period', minWidth: 120 },
    { id: 'filename', label: 'File', minWidth: 180 },
    { id: 'uploaded_at', label: 'Uploaded Date', minWidth: 130 },
    { id: 'actions', label: 'Actions', minWidth: 150, align: 'center' }
  ];

  return (
    <div>
      <Header />
      <main className="bg-gray-100 pt-[65px] min-h-screen">
        <div className="flex flex-col md:flex-row">
          <AdminSidebar date={date} setDate={setDate} eventDates={eventDates} />
          
          <div className="w-full md:w-3/4 px-4 py-6">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Coordinator Reports</h1>
            <p className="mb-6 text-gray-600">View and download all reports uploaded by coordinators from different universities.</p>

            {/* Search Bar */}
            <Box className="mb-6">
              <TextField
                fullWidth
                label="Search reports by title, university, or filename..."
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ backgroundColor: 'white' }}
              />
            </Box>

            {/* Reports Table */}
            <TableContainer component={Paper} className="shadow-lg">
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align || 'left'}
                        style={{ minWidth: column.minWidth, fontWeight: 'bold', backgroundColor: '#e8eaf6' }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                        <Typography>Loading reports...</Typography>
                      </TableCell>
                    </TableRow>
                  ) : filteredReports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                        <Typography color="textSecondary">No reports found.</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredReports.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((report, idx) => (
                      <TableRow key={report._id || idx} hover>
                        <TableCell>{report.university_name || 'N/A'}</TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500, maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {report.title || 'Untitled'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getMonthYear(report.month, report.year)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" title={report.original_filename}>
                            {report.original_filename?.length > 30
                              ? report.original_filename.substring(0, 27) + '...'
                              : report.original_filename || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>{formatDate(report.uploaded_at)}</TableCell>
                        <TableCell align="center">
                          <Button
                            size="small"
                            startIcon={<ViewIcon />}
                            onClick={() => handleViewReport(report)}
                            sx={{ mr: 1, color: 'info.main' }}
                          >
                            View
                          </Button>
                          <Button
                            size="small"
                            startIcon={<DownloadIcon />}
                            onClick={() => handleDownloadReport(report)}
                            sx={{ color: 'success.main' }}
                          >
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={filteredReports.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>

            {/* Report Details Modal */}
            {selectedReport && (
              <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#1976d2' }}>
                  {selectedReport.title || 'Report Details'}
                </DialogTitle>
                <DialogContent dividers>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666' }}>University</Typography>
                      <Typography variant="body2">{selectedReport.university_name || 'N/A'}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666' }}>Report Title</Typography>
                      <Typography variant="body2">{selectedReport.title || 'N/A'}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666' }}>Period</Typography>
                      <Typography variant="body2">{getMonthYear(selectedReport.month, selectedReport.year)}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666' }}>Summary</Typography>
                      <Typography variant="body2">{selectedReport.summary || 'No summary provided'}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666' }}>File</Typography>
                      <Typography variant="caption">{selectedReport.original_filename || 'N/A'}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666' }}>Uploaded On</Typography>
                      <Typography variant="body2">{formatDate(selectedReport.uploaded_at)}</Typography>
                    </Box>
                  </Box>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseModal} color="primary">Close</Button>
                  <Button
                    onClick={() => {
                      handleDownloadReport(selectedReport);
                      handleCloseModal();
                    }}
                    variant="contained"
                    color="success"
                    startIcon={<DownloadIcon />}
                  >
                    Download
                  </Button>
                </DialogActions>
              </Dialog>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoordinatorReports;
