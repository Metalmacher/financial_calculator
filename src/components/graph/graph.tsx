import React from "react";
import { ProfileSeries, shekelSign } from "@interfaces";
import "./graph.css";
import { Box, Typography, Slider } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { getBackground } from "@utils";
import { useLocalStorage } from "src/hooks";

interface ProfilesGraphProps {
  profilesSeries: ProfileSeries[];
  totalYears: number;
  annualGrowthRate: number;
}

export const ProfilesGraph: React.FC<ProfilesGraphProps> = ({
  profilesSeries,
  totalYears,
}) => {
  const currentYear = new Date().getFullYear();
  const minDistance = 1;
  const defaultRange = [currentYear, currentYear + totalYears];
  const [range, setRange] = useLocalStorage("graphRange", [...defaultRange]);
  const handleSliderChange = (
    _event: Event,
    newValue: number | number[],
    activeThumb: number,
  ) => {
      if (!Array.isArray(newValue)) {
        return;
      }
      if (newValue[1] - newValue[0] < minDistance) {
        if (activeThumb === 0) {
          setRange([newValue[0] - minDistance, newValue[1]]);
        } else {
          setRange([newValue[0], newValue[1] + minDistance]);
        }
      } else {
        setRange(newValue as number[]);
      }
  }
  const rangedProfiles = profilesSeries.map(x => 
      x.data.slice(range[0] - currentYear, (range[0] - currentYear) + (range[1] - range[0]) + 1));
  const min = Math.min(...rangedProfiles.map(x => [...x].shift() as number));
  const max = Math.max(...rangedProfiles.map(x => [...x].pop() as number));
  const plansByResult = profilesSeries.sort(
    (a, b) => b.data[b.data.length - 1] - a.data[a.data.length - 1]
  );
  const bestPlan = plansByResult[0];
  return (
    <>
      <Box className="profilesGraphContainer">
        {!profilesSeries.length ? (<Box>No profiles...</Box>) : (
          <Box>
          <Box className="profilesGraph">
          <LineChart
            xAxis={[
              {
                data: Array.from(
                  { length: totalYears + 1 },
                  (_v, k) => currentYear + k
                ),
                min: range[0],
                max: range[1],
                tickMinStep: 1
              },
            ]}
            yAxis={[{
              min: Math.max(min - (max - min)*0.2, 0),
              max: max + (max - min)*0.2
            }]}
            series={profilesSeries.map((p) => ({
              data: p.data,
              label: p.name,
              color: p.color,
            }))}
            margin={{
              left: 75
            }}
            height={300}
          />
          <Slider
              className="rangeSelector"
              value={range}
              onChange={handleSliderChange}
              valueLabelDisplay="auto"
              min={defaultRange[0]}
              max={defaultRange[1]}
              marks
              disableSwap
              sx={{ mt: 2 }}
          />
        </Box>
        <Box className="summary">
          <Typography variant="h5">
            The best plan is{" "}
            <u
              style={{
                backgroundColor: bestPlan.color,
                color: getBackground(bestPlan.color),
              }}
            >
              {bestPlan.name}
            </u>
            <br />
            with a total of{" "}
            <u
              style={{
                backgroundColor: bestPlan.color,
                color: getBackground(bestPlan.color),
              }}
            >
              {shekelSign +
                bestPlan.data[bestPlan.data.length - 1].toLocaleString()}
            </u>{" "}
            after {totalYears} years.
            <br />
            <br />
          </Typography>
          <Typography variant="h6">
            <u>List of all profiles after {totalYears} years:</u>
          </Typography>
          <ol className="plansList">
            {plansByResult.map((profile) => (
              <li className="profileListItem" key={profile.name}>
                {profile.name} -{" "}
                {shekelSign +
                  profile.data[profile.data.length - 1].toLocaleString()}
              </li>
            ))}
          </ol>
        </Box>
        </Box>
        )}
      </Box>
    </>
  );
};
