import { useState } from "react";
import { Link } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

// Forex Signal 1.0 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";
import { useToast, Toast } from "toastify-simply-react";

// Forex Signal 1.0 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// AuthService
import AuthService from "services/auth-service";

function AddSignal() {
  const [signal, setSignal] = useState({});
  const [credentialsError, setCredentialsError] = useState(null);
  const [toast, toastRef] = useToast();

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [inputs, setInputs] = useState({
    name: "",
    future: 0,
    type: "crypto",
    leverage: "",
    entry: "",
    stop: "",
    take: "",
    move: "",
    action: "",
    expire: "",
  });

  const [errors, setErrors] = useState({
    nameError: false,
    futureError: false,
    typeError: false,
    leverageError: false,
    entryError: false,
    stopError: false,
    takeError: false,
    moveError: false,
    actionError: false,
    expireError: false,
  });

  const addSignalHandler = (newSignal) => setSignal(newSignal);

  const changeHandler = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const imageChangeHandler = (e) => {

    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
        setImagePreview(reader.result);
        setImage(reader.result);
        console.log(image);
    }

  };

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(image);
    const newSignal = {
      name: inputs.name,
      future: inputs.future,
      type: inputs.type,
      leverage: inputs.leverage,
      stop: inputs.stop,
      entry: inputs.entry,
      take: inputs.take,
      move: inputs.move,
      action: inputs.action,
      expire: inputs.expire,
      image: image,
    };
    addSignalHandler(newSignal);

    const myData = {
      data: {
        type: "token",
        attributes: { ...newSignal },
      },
    };

    try {
      const response = await AuthService.addSignal(myData);
      toast.primary(response.message);

      setInputs({
        name: "",
        future: 0,
        type: "crypto",
        leverage: "",
        entry: "",
        stop: "",
        take: "",
        move: "",
        action: "",
        expire: "",
      });

      setImage(null);
      setImagePreview(null);

      setErrors({
        nameError: false,
        futureError: false,
        typeError: false,
        leverageError: false,
        entryError: false,
        stopError: false,
        takeError: false,
        moveError: false,
        actionError: false,
        expireError: false,
      });
    } catch (res) {
      setCredentialsError(res.errors);
    }
  };

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
                  Add New Signal
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <MDBox
                  component="form"
                  role="form"
                  method="POST"
                  onSubmit={submitHandler}
                >
                  {imagePreview && (
                    <MDBox mb={2}>
                      <img
                        src={imagePreview}
                        alt="Image Preview"
                        width="100px"
                      />
                    </MDBox>
                  )}
                  <MDBox mb={2}>
                    <MDInput
                      type="file"
                      label="Upload Image"
                      fullWidth
                      name="image"
                      onChange={imageChangeHandler}
                    />
                  </MDBox>
                  <MDBox sx={{ minWidth: 120 }}>
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
                        value={inputs.type}
                        label="Type"
                        name="type"
                        error={errors.typeError}
                        onChange={changeHandler}
                      >
                        <MenuItem value={"crypto"}>Crypto</MenuItem>
                        <MenuItem value={"forex"}>Forex</MenuItem>
                      </Select>
                    </FormControl>
                  </MDBox>
                  <MDBox sx={{ minWidth: 120 }}>
                    <FormControl
                      fullWidth
                      style={{
                        marginTop: 10,
                        height: "50px",
                      }}
                    >
                      <InputLabel id="future">IS FUTURE</InputLabel>
                      <Select
                        labelId="future"
                        id="future"
                        value={inputs.future}
                        label="Is Future"
                        name="future"
                        error={errors.futureError}
                        onChange={changeHandler}
                      >
                        <MenuItem value={0}>No</MenuItem>
                        <MenuItem value={1}>Yes</MenuItem>
                      </Select>
                    </FormControl>
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput
                      type="text"
                      label="Signal Name"
                      fullWidth
                      value={inputs.name}
                      name="name"
                      onChange={changeHandler}
                      error={errors.nameError}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput
                      type="text"
                      label="Leverage (Optional)"
                      fullWidth
                      name="leverage"
                      value={inputs.leverage}
                      onChange={changeHandler}
                      error={errors.leverageError}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput
                      type="text"
                      label="Entry Price (Optional)"
                      fullWidth
                      name="entry"
                      value={inputs.entry}
                      onChange={changeHandler}
                      error={errors.entryError}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput
                      type="text"
                      label="Stop Loss"
                      fullWidth
                      name="stop"
                      value={inputs.stop}
                      onChange={changeHandler}
                      error={errors.stopError}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput
                      type="text"
                      label="Take Profit"
                      fullWidth
                      name="take"
                      value={inputs.take}
                      onChange={changeHandler}
                      error={errors.takeError}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput
                      type="text"
                      label="Move"
                      fullWidth
                      name="move"
                      value={inputs.move}
                      onChange={changeHandler}
                      error={errors.moveError}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput
                      type="text"
                      label="Action"
                      fullWidth
                      name="action"
                      value={inputs.action}
                      onChange={changeHandler}
                      error={errors.actionError}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput
                      type="datetime-local"
                      label="Expire Time"
                      fullWidth
                      name="expire"
                      value={inputs.expire}
                      onChange={changeHandler}
                      error={errors.expireError}
                    />
                  </MDBox>
                  <MDBox mt={4} mb={1}>
                    <MDButton
                      variant="gradient"
                      color="info"
                      fullWidth
                      type="submit"
                    >
                      Add Signal
                    </MDButton>
                  </MDBox>
                  {credentialsError && (
                    <MDTypography
                      variant="caption"
                      color="error"
                      fontWeight="light"
                    >
                      {credentialsError}
                    </MDTypography>
                  )}
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
      <Toast ref={toastRef} />
    </DashboardLayout>
  );
}

export default AddSignal;
