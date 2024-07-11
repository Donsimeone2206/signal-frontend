import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

// Forex Signal 1.0 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAlert from "components/MDAlert";

// Forex Signal 1.0 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// AuthService
import AuthService from "services/auth-service";

const SignalManagement = () => {
  const [signal, setSignal] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const [credentialsError, setCredentialsError] = useState(null);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState(null);
  const [signalToDelete, setSignalToDelete] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsPending(true);
      setCredentialsError(null);
      setError(null);

      try {
        const response = await AuthService.getSignals();
        if (!response) {
          throw new Error("Network response was not ok");
        }
        const result = await response;
        setSignal(result);
      } catch (err) {
        setCredentialsError(err);
        setError(err);
      } finally {
        setIsPending(false);
      }
    };

    fetchData();
  }, []);

  const handleEditClick = (signalItem) => {
    setSelectedSignal({
      ...signalItem,
      expire: new Date(signalItem.expire).toISOString().slice(0, 16),
    });
    setImagePreview(signalItem.image);
    setImage(signalItem.image);
    setOpen(true);
  };

  const handleDeleteClick = (signalItem) => {
    setSignalToDelete(signalItem);
    setDeleteDialogOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSignal(null);
    setImage(null);
    setImagePreview(null);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSignalToDelete(null);
  };

  const handleInputChange = (e) => {
    setSelectedSignal({
      ...selectedSignal,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setImage(reader.result);
    };
  };

  const handleSave = async () => {
    try {
      const selectedSignalId = selectedSignal.id;
      const updatedSignal = {
        ...selectedSignal,
        image: image,
      };
      const response = await AuthService.updateSignal({
        selectedSignalId,
        updatedSignal,
      });
      setOpen(false);
      setSignal((prevSignals) =>
        prevSignals.map((signal) =>
          signal.id === selectedSignal.id ? updatedSignal : signal
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      const id = signalToDelete.id;
      await AuthService.deleteSignal({
        id,
      });
      setSignal((prevSignals) =>
        prevSignals.filter((signal) => signal.id !== signalToDelete.id)
      );
      setDeleteDialogOpen(false);
      setSignalToDelete(null);
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { Header: "Name", accessor: "name", align: "left" },
    { Header: "Image", accessor: "image", align: "left" },
    { Header: "Type", accessor: "type", align: "left" },
    { Header: "Is Future Trade", accessor: "future", align: "left" },
    { Header: "Leverage", accessor: "leverage", align: "left" },
    { Header: "Entry Price", accessor: "entry", align: "left" },
    { Header: "Stop Loss", accessor: "stop", align: "center" },
    { Header: "Take Profit", accessor: "take", align: "center" },
    { Header: "Expire", accessor: "expire", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
  ];

  const rows = signal.map((signalItem) => ({
    name: signalItem.name,
    image: (
      <img
        src={signalItem.image}
        alt="signal"
        style={{ width: "50px", height: "50px" }}
      />
    ),
    type: signalItem.type,
    future: signalItem.future ? "Yes" : "No",
    leverage: signalItem.leverage,
    entry: signalItem.entry,
    stop: signalItem.stop,
    take: signalItem.take,
    expire: new Date(signalItem.expire).toLocaleString(),
    action: (
      <MDBox>
        <MDTypography
          component="a"
          href="#"
          variant="caption"
          color="text"
          fontWeight="medium"
          mr={2}
          onClick={() => handleEditClick(signalItem)}
        >
          Edit
        </MDTypography>
        <MDTypography
          component="a"
          href="#"
          variant="caption"
          color="text"
          fontWeight="medium"
          onClick={() => handleDeleteClick(signalItem)}
        >
          Delete
        </MDTypography>
      </MDBox>
    ),
  }));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Signal Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                {isPending && (
                  <MDTypography variant="h6">Loading...</MDTypography>
                )}
                {error && <MDAlert color="error">{error.message}</MDAlert>}
                {!isPending && !error && (
                  <DataTable
                    table={{ columns, rows }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2>Edit Signal</h2>
          {selectedSignal && (
            <>
              {imagePreview && (
                <Box mb={2}>
                  <img src={imagePreview} alt="Image Preview" width="70px" />
                </Box>
              )}
              <TextField
                fullWidth
                type="file"
                label="Upload Image"
                name="image"
                onChange={handleImageChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={selectedSignal.name}
                onChange={handleInputChange}
                margin="normal"
              />
              <FormControl
                fullWidth
                style={{
                  marginTop: 10,
                  height: "50px",
                }}
              >
                <InputLabel id="type">Type</InputLabel>
                <Select
                  labelId="type"
                  id="type"
                  value={selectedSignal.type}
                  label="Type"
                  name="type"
                  onChange={handleInputChange}
                >
                  <MenuItem value={"crypto"}>Crypto</MenuItem>
                  <MenuItem value={"forex"}>Forex</MenuItem>
                </Select>
              </FormControl>
              <FormControl
                fullWidth
                style={{
                  marginTop: 10,
                  height: "50px",
                }}
              >
                <InputLabel id="future">Is Future</InputLabel>
                <Select
                  labelId="future"
                  id="future"
                  value={selectedSignal.future}
                  label="Is Future"
                  name="future"
                  onChange={handleInputChange}
                >
                  <MenuItem value={0}>No</MenuItem>
                  <MenuItem value={1}>Yes</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Leverage"
                name="leverage"
                value={selectedSignal.leverage}
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Entry Price"
                name="entry"
                value={selectedSignal.entry}
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Stop Loss"
                name="stop"
                value={selectedSignal.stop}
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Take Profit"
                name="take"
                value={selectedSignal.take}
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                fullWidth
                type="datetime-local"
                label="Expire"
                name="expire"
                value={selectedSignal.expire}
                onChange={handleInputChange}
                margin="normal"
              />
              <Box mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                >
                  Save
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>{"Delete Signal"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this signal?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default SignalManagement;
