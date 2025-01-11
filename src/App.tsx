import "./App.css";
import { Box } from "@mui/material";
import ProfileList from "./components/profiles_list/profiles_list";

function App() {
  return (
    <>
      <Box>
        <h1 className="header">Financial Advisor</h1>
      </Box>
      <ProfileList></ProfileList>
    </>
  );
}

export default App;
