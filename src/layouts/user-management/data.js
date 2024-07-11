import { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import AuthService from "services/auth-service";

export default function DataComponent() {
  const [signal, setSignal] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsPending(true);
      setError(null);

      try {
        const response = await AuthService.getSignals();
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response
        setSignal(result);
        console.log(result);
        console.log(signal);
      } catch (err) {
        setError(err);
      } finally {
        setIsPending(false);
      }
    };

    fetchData();
  }, []);

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (signal.length > 0) {
    const columns = [
      { Header: "Name", accessor: "name", align: "left" },
      { Header: "Type", accessor: "type", align: "left" },
      { Header: "Leverage", accessor: "leverage", align: "left" },
      { Header: "Stop Loss", accessor: "stop", align: "center" },
      { Header: "Take Profit", accessor: "take", align: "center" },
      { Header: "Expire", accessor: "expire", align: "center" },
      { Header: "Action", accessor: "action", align: "center" },
    ];

    // const rows = signal.map((signalItem) => ({
    //   name: signalItem.name,
    //   type: signalItem.type,
    //   leverage: signalItem.leverage,
    //   stop: signalItem.stop,
    //   take: signalItem.take,
    //   expire: signalItem.expire,
    //   action: (
    //     <MDBox>
    //       <MDTypography
    //         component="a"
    //         href="#"
    //         variant="caption"
    //         color="text"
    //         fontWeight="medium"
    //         mr={2}
    //       >
    //         Edit
    //       </MDTypography>
    //       <MDTypography
    //         component="a"
    //         href="#"
    //         variant="caption"
    //         color="text"
    //         fontWeight="medium"
    //       >
    //         Delete
    //       </MDTypography>
    //     </MDBox>
    //   ),
    // }));

    return (
      <div>
        {/* <div>Columns: {JSON.stringify(columns, null, 2)}</div> */}
        {/* <div>Rows: {JSON.stringify(rows, null, 2)}</div> */}
      </div>
    );
  }

  return (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      mt={-10}
      mb={10}
      style={{ height: "100vh" }}
    >
      <MDTypography variant="h1" color="white" textAlign="center">
        No Signal Or Loading
      </MDTypography>
    </MDBox>
  );
}
