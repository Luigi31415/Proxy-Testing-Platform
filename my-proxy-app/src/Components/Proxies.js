import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { Table, TableHead, TableBody, TableCell, TableContainer, TableRow, Paper, Button, Box, Typography } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const useStyles = makeStyles({
  table: {
    minWidth: 1000,
  },
  container: {
    display: 'flex',
    flexDirection: 'column', // Stack tables vertically
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    margin: '0 200px', // Adjust the margin as needed
  },
  box: {
    background: "#f5f5f5",
    padding: "20px", // Adjust padding as needed
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: "20px", // Add margin bottom for separation
  },
  tableTitle: {
    marginBottom: "10px",
  },
});

const Proxies = () => {
  const classes = useStyles();
  const [proxies, setProxies] = useState([]);
  let token = localStorage.getItem("jwtToken")
  let navigate = useNavigate();
  const decodedToken = token ? jwtDecode(token) : null;
  const user_id = decodedToken?.user_id;
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if(!token)
        {
          navigate("/login");
        }
        const response = await fetch(process.env.REACT_APP_API_URL + "/proxies", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`,
          },
        });
        if(response.status === 401)
      {
        localStorage.removeItem("jwtToken");
        navigate("/login");
      }
      else if (response.ok) {
          const data = await response.json();
          setProxies(data.proxies);
        } else {
          console.error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error occurred while fetching data:', error);
      }
    };

    fetchData();
  }, [token, navigate]);

  const handleClaimProxy = async (proxy_id) => {
    try {
      console.log("Proxy ID:", proxy_id);
      const response = await fetch(process.env.REACT_APP_API_URL + "/proxies/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body:
          JSON.stringify({ proxy_id }),
      });

      if(response.status === 401)
      {
        localStorage.removeItem("jwtToken");
        navigate("/login");
      }
      else if (response.ok) {
        const updatedProxies = proxies.map(proxy => {
          if (proxy.proxy_id === proxy_id) {
            return { ...proxy, owner: user_id };
          }
          return proxy;
        });
        setProxies(updatedProxies);
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error occurred while claiming proxy:', error);
    }
  };

  const handleUnclaimProxy = async (proxy_id) => {
    try {
      console.log("Proxy ID:", proxy_id);
      const response = await fetch(process.env.REACT_APP_API_URL + "/proxies/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body:
          JSON.stringify({ proxy_id }),
      });
      if(response.status === 401)
      {
        localStorage.removeItem("jwtToken");
        navigate("/login");
      }
      else if (response.ok) {
        const updatedProxies = proxies.map(proxy => {
          if (proxy.proxy_id === proxy_id) {
            return { ...proxy, owner: null };
          }
          return proxy;
        });
        setProxies(updatedProxies);
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error occurred while claiming proxy:', error);
    }
  };

  return (
    <div className={classes.container}>
      <Box className={classes.box}>
        {/* First Table */}
        <Box>
          <Typography variant="h6" gutterBottom className={classes.tableTitle}>
            Your Proxies
          </Typography>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Proxy IP</TableCell>
                  <TableCell>Proxy Port</TableCell>
                  <TableCell>Proxy Status</TableCell>
                  <TableCell>Last Checked</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {proxies.filter(proxy => proxy.owner === user_id).map((proxy) => (
                  <TableRow key={proxy.proxy_id}>
                    <TableCell>{proxy.ip}</TableCell>
                    <TableCell>{proxy.port}</TableCell>
                    <TableCell>{proxy.status}</TableCell>
                    <TableCell>{moment(proxy.last_checked).format('MMMM Do YYYY, h:mm:ss a')}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="primary" onClick={() => handleUnclaimProxy(proxy.proxy_id)}>
                        Unclaim Proxy
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      <Box className={classes.box}>
        {/* Second Table */}
        <Box>
          <Typography variant="h6" gutterBottom className={classes.tableTitle}>
            Unclaimed Proxies
          </Typography>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Proxy IP</TableCell>
                  <TableCell>Proxy Port</TableCell>
                  <TableCell>Proxy Status</TableCell>
                  <TableCell>Last Checked</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {proxies.filter(proxy => !proxy.owner).map((proxy) => (
                  <TableRow key={proxy.proxy_id}>
                    <TableCell>{proxy.ip}</TableCell>
                    <TableCell>{proxy.port}</TableCell>
                    <TableCell>{proxy.status}</TableCell>
                    <TableCell>{moment(proxy.last_checked).format('MMMM Do YYYY, h:mm:ss a')}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="primary" onClick={() => handleClaimProxy(proxy.proxy_id)}>
                        Claim Proxy
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </div>
  );
};

export default Proxies;
