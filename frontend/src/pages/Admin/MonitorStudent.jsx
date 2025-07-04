import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Header from "../../components/Admin/Header";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import StickyHeadTable from "../../components/Admin/StickyHeadTable";

import {
  Box,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  Select,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

/* ——— tiny helper to draw bar ——— */
const ProgressBar = ({ pct }) => (
  <Box
    display="flex"
    alignItems="center"
    gap={1}
    minWidth={150}
  >
    <Typography sx={{ minWidth: 30, fontWeight: 500 }}>{pct}%</Typography>
    <Box
      sx={{
        flex: 1,
        height: 10,
        backgroundColor: "#e0e0e0",
        borderRadius: 5,
      }}
    >
      <Box
        sx={{
          width: `${pct}%`,
          height: "100%",
          backgroundColor: "#4caf50",
          borderRadius: 5,
        }}
      />
    </Box>
  </Box>
);
/* ——————————————————————————————— */

const MonitorStudent = () => {
  const [date, setDate] = useState(new Date());
  const [rows, setRows] = useState([]);

  /* UI state */
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [sortValue, setSortValue] = useState("");

  /* fetch */
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/monitoringstudents")
      .then(({ data }) => {
        const mapped = data.map((doc, idx) => ({
          id: doc._id?.toString() || idx,
          count: idx + 1,
          name: doc.name,
          unid: doc.unid,
          email: doc.email,
          progress: Number((doc.progress || "0").toString().replace("%", "")),
          supervisor: doc.supervisor,
        }));
        setRows(mapped);
      })
      .catch(console.error);
  }, []);

  /* supervisor list */
  const supervisors = useMemo(
    () => [...new Set(rows.map((r) => r.supervisor))],
    [rows]
  );

  /* filter + sort */
  const processedRows = useMemo(() => {
    let temp = rows.filter((row) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        row.name.toLowerCase().includes(q) ||
        row.email.toLowerCase().includes(q) ||
        row.unid.toLowerCase().includes(q);

      let matchesFilter = true;
      if (filterValue.startsWith("sup:")) {
        matchesFilter = row.supervisor === filterValue.slice(4);
      } else if (filterValue.startsWith("prog:")) {
        const val = row.progress;
        const range = filterValue.slice(5);
        matchesFilter =
          (range === "low" && val <= 30) ||
          (range === "mid" && val > 30 && val <= 70) ||
          (range === "high" && val > 70);
      }
      return matchesSearch && matchesFilter;
    });

    if (sortValue === "az") temp.sort((a, b) => a.name.localeCompare(b.name));
    if (sortValue === "prog") temp.sort((a, b) => a.progress - b.progress);
    return temp;
  }, [rows, searchTerm, filterValue, sortValue]);

  /* columns with centered header & percentage+bar render */
  const columns = [
    { id: "count", label: "#", align: "center" },
    { id: "name", label: "Name" },
    { id: "unid", label: "ID" },
    { id: "email", label: "Email" },
    {
      id: "progress",
      label: "Progress",
      align: "center",
      render: (v) => <ProgressBar pct={v} />,
    },
    { id: "supervisor", label: "Supervisor" },
  ];

  return (
    <div>
      <Header />
      <main className="bg-gray-100 pt-[65px] min-h-screen">
        <div className="flex flex-col md:flex-row">
          <AdminSidebar date={date} setDate={setDate} eventDates={[]} />

          <div className="w-full md:w-3/4 px-4 py-6">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-4">
              Monitor Students
            </h1>

            {/* top controls */}
            <Box
              mb={3}
              display="flex"
              flexWrap="wrap"
              gap={2}
              alignItems="center"
              justifyContent="space-between"
            >
              {/* search (pill + icon right) */}
              <TextField
                placeholder="Search by name, email, or ID"
                size="small"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: "9999px",
                  width: { xs: "100%", sm: 300 },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />

              {/* filter & sort */}
              <Box display="flex" gap={2} flexWrap="wrap">
                <FormControl size="small" sx={{ minWidth: 170 }}>
                  <Select
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    displayEmpty
                    sx={{ background: "#fff", borderRadius: 3 }}
                  >
                    <MenuItem value="">
                      <p>Filter by</p>
                    </MenuItem>
                    <MenuItem disabled>
                      <Typography variant="subtitle2">Supervisor</Typography>
                    </MenuItem>
                    {supervisors.map((s, i) => (
                      <MenuItem key={i} value={`sup:${s}`}>
                        {s}
                      </MenuItem>
                    ))}
                    <MenuItem disabled>
                      <Typography variant="subtitle2">Progress</Typography>
                    </MenuItem>
                    <MenuItem value="prog:low">0 – 30 %</MenuItem>
                    <MenuItem value="prog:mid">31 – 70 %</MenuItem>
                    <MenuItem value="prog:high">71 – 100 %</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <Select
                    value={sortValue}
                    onChange={(e) => setSortValue(e.target.value)}
                    displayEmpty
                    sx={{ background: "#fff", borderRadius: 3 }}
                  >
                    <MenuItem value="">
                      <p>Sort by</p>
                    </MenuItem>
                    <MenuItem value="az">Name A→Z</MenuItem>
                    <MenuItem value="prog">Progress 1–100</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* data table */}
            <StickyHeadTable rows={processedRows} columns={columns} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MonitorStudent;
