import "./App.css";
import { Box, TextField, Typography } from "@mui/material";
import { ProfileList, ProfilesGraph } from "@components";
import { useLocalStorage } from "@hooks";
import { Profile } from "@interfaces";
import { initialProfiles } from "@data";
import { useState } from "react";
import { NumericFormat } from "react-number-format";
import { debouncedMethod } from "@utils";

function App() {
  const [profiles, setProfiles] = useLocalStorage(
    "profiles",
    initialProfiles as Profile[]
  );
  const [totalYears, setTotalYears] = useState(20);
  const [annualGrowthRate, setAnnualGrowthRate] = useState(0.05);
  const setTotalYearsDeb = debouncedMethod(setTotalYears, 500);
  const setAnnualGrowthRateDeb = debouncedMethod(setAnnualGrowthRate, 500);

  return (
    <>
      <Box>
        <h1 className="header">Financial Advisor</h1>
      </Box>
      <Box className="appBodyBg">
        <Box className="appBody">
          <Box className="globalSettings">
            <Typography variant="h4">Settings</Typography>
            <Box className="globalSettingsFields">
              <NumericFormat
                value={totalYears}
                onValueChange={(e) => setTotalYearsDeb(e.floatValue as number)}
                customInput={TextField}
                thousandSeparator
                variant="standard"
                label="Total Years"
                slotProps={{
                  input: {
                    style: { fontSize: "20px" }, // Change input text font size
                  },
                  inputLabel: {
                    style: { fontSize: "20px" },
                  },
                }}
              />
              <NumericFormat
                value={annualGrowthRate}
                onValueChange={(e) =>
                  setAnnualGrowthRateDeb(e.floatValue as number)
                }
                customInput={TextField}
                thousandSeparator
                variant="standard"
                label="annual Growth Rate"
                slotProps={{
                  input: {
                    style: { fontSize: "20px" }, // Change input text font size
                  },
                  inputLabel: {
                    style: { fontSize: "20px" },
                  },
                }}
              />
            </Box>
          </Box>
          <ProfileList
            callback={(newProfiles: Profile[]) => setProfiles(newProfiles)}
            profiles={profiles}
          ></ProfileList>
          <ProfilesGraph
            profiles={profiles}
            totalYears={totalYears}
            annualGrowthRate={annualGrowthRate}
          ></ProfilesGraph>
        </Box>
      </Box>
    </>
  );
}

export default App;
