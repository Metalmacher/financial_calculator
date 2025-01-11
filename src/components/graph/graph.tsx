import { Profile, shekelSign } from "@interfaces";
import "./graph.css";
import { Box, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { calculatePortfolioGrowthPerYear, getBackground } from "@utils";

interface ProfilesGraphProps {
  profiles: Profile[];
  totalYears: number;
  annualGrowthRate: number;
}

export const ProfilesGraph: React.FC<ProfilesGraphProps> = ({
  profiles,
  totalYears,
  annualGrowthRate,
}) => {
  const profilesSeries = profiles.map((profile) => ({
    ...profile,
    data: calculatePortfolioGrowthPerYear(
      profile,
      totalYears,
      annualGrowthRate
    ),
  }));
  const currentYear = new Date().getFullYear();
  const plansByResult = profilesSeries.sort(
    (a, b) => b.data[b.data.length - 1] - a.data[a.data.length - 1]
  );
  debugger;
  const bestPlan = plansByResult[0];
  return (
    <>
      <Box className="profilesGraph">
        <LineChart
          xAxis={[
            {
              data: Array.from(
                { length: totalYears + 1 },
                (_v, k) => currentYear + k
              ),
            },
          ]}
          series={profilesSeries.map((p) => ({
            data: p.data,
            label: p.name,
            color: p.color,
          }))}
          width={1200}
          height={300}
        />
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
    </>
  );
};
