import "./App.css";
import { Box, Button, InputAdornment, TextField, Typography } from "@mui/material";
import { ProfileList, ProfilesGraph } from "@components";
import { useLocalStorage } from "@hooks";
import { Profile, ProfilesSummary } from "@interfaces";
import { initialProfiles } from "@data";
import RestoreIcon from '@mui/icons-material/Restore';
import { NumericFormat } from "react-number-format";
import { calculatePortfolioGrowthPerYear, debouncedMethod } from "@utils";
import { useCallback, useEffect, useState } from "react";

function App() {
  const [profiles, setProfiles] = useLocalStorage(
    "profiles",
    initialProfiles as Profile[]
  );
  const [totalYears, setTotalYears] = useLocalStorage("totalYears", 20);
  const [annualGrowthRate, setAnnualGrowthRate] = useLocalStorage("annualGrowthRate", 5);
  const calcProfilesSummary = function (profiles: Profile[], totalYears: number, annualGrowthRate: number) {
    return {
        totalYears,
        annualGrowthRate,
        profiles: profiles.map((profile) => ({
            ...profile,
            data: calculatePortfolioGrowthPerYear(
              profile,
              totalYears,
              annualGrowthRate
            ),
          }))
    } as ProfilesSummary;
  }
  const [profilesSummary, setProfilesSummary] = useState<ProfilesSummary>(() => ({
    totalYears,
    annualGrowthRate,
    profiles: profiles.map((profile) => ({
        ...profile,
        data: calculatePortfolioGrowthPerYear(
          profile,
          totalYears,
          annualGrowthRate
        ),
      }))
    }));
  
  const setProfilesSummaryDeb = useCallback(debouncedMethod((profiles: Profile[], totalYears: number, annualGrowthRate: number) => {
    setProfilesSummary(calcProfilesSummary(profiles, totalYears, annualGrowthRate))
  }, 200), []);

  const resetState = () => {
    localStorage.clear();
    window.location.reload();
  }
  useEffect(() => {
    setProfilesSummaryDeb(profiles, totalYears, annualGrowthRate);
  }, [annualGrowthRate, totalYears, profiles]);
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
                  onValueChange={(e) => setTotalYears(e.floatValue as number)}
                  customInput={TextField}
                  thousandSeparator
                  variant="standard"
                  sx={{ width: '10ch' }}
                  label="Total Years"
                  slotProps={{
                    input: {
                      style: { fontSize: "20px" }, // Change input text font size
                    },
                    inputLabel: {
                      style: { fontSize: "20px" },
                    },
                    htmlInput: {
                        type: "number",
                        min: 1,
                        max:80
                    }
                  }}
                />
                <TextField
                  value={annualGrowthRate}
                  onChange={(e) =>
                    setAnnualGrowthRate(parseInt(e.target.value) as number)
                  }
                  variant="standard"
                  prefix="% "
                  type="number"
                  sx={{width: '10ch' }}
                  label="Annual Growth Rate"
                  slotProps={{
                    input: {
                      style: { fontSize: "20px" }, // Change input text font size
                      type: "number",
                      startAdornment: <InputAdornment position="start">%</InputAdornment>
                    },
                    inputLabel: {
                      style: { 
                        fontSize: "20px",
                        overflow: "visible"
                    },
                    },
                    htmlInput: {
                        min: 0,
                        max: 100
                    }
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
                profilesSummary={profilesSummary}
            ></ProfilesGraph>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default App;
