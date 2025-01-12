import "./App.css";
import { Box, Button, TextField, Typography } from "@mui/material";
import { ProfileList, ProfilesGraph } from "@components";
import { useLocalStorage } from "@hooks";
import { Profile, ProfileSeries } from "@interfaces";
import { initialProfiles } from "@data";
import RestoreIcon from '@mui/icons-material/Restore';
import { NumericFormat } from "react-number-format";
import { calculatePortfolioGrowthPerYear, debouncedMethod } from "@utils";

function App() {
  const [profiles, setProfiles] = useLocalStorage(
    "profiles",
    initialProfiles as Profile[]
  );
  const [totalYears, setTotalYears] = useLocalStorage("totalYears", 20);
  const [annualGrowthRate, setAnnualGrowthRate] = useLocalStorage("annualGrowthRate", 5);
  const setTotalYearsDeb = debouncedMethod(setTotalYears, 500);
  const setAnnualGrowthRateDeb = debouncedMethod(setAnnualGrowthRate, 500);
  const resetState = () => {
    localStorage.clear();
    window.location.reload();
  }
  const profilesSeries: ProfileSeries[] = profiles.map((profile) => ({
    ...profile,
    data: calculatePortfolioGrowthPerYear(
      profile,
      totalYears,
      annualGrowthRate
    ),
  }));
  return (
    <>
      <Box className="header">
        <Typography variant="h1">Financial Advisor</Typography>
      </Box>
      <Box className="appBodyBg">
        <Box className="appBody">
          <Box className="globalSettingsBg">
            <Box className="globalSettings">
              <Typography variant="h4"><u>Settings</u></Typography>
              <Box className="globalSettingsFields">
                <Box className="settingsLeft">
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
                  max={100}
                  min={1}
                  prefix="% "
                  label="annual Growth Rate"
                  isAllowed={(values) => {
                    const { floatValue } = values;
                    return (
                      floatValue === undefined ||
                      (floatValue >= 1 && floatValue <= 100)
                    );
                  }}
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
                <Box className="settingsRight">
                    <Button 
                    variant="contained"
                    color="warning"
                    onClick={resetState}
                    endIcon={<RestoreIcon />}>
                        RESET SETTINGS
                    </Button>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box className="list">
            <ProfileList
                callback={(newProfiles: Profile[]) => setProfiles(newProfiles)}
                profiles={profiles}
            ></ProfileList>
          </Box>
          <Box className="graph">
            <ProfilesGraph
                profilesSeries={profilesSeries}
                totalYears={totalYears}
                annualGrowthRate={annualGrowthRate}
            ></ProfilesGraph>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default App;
