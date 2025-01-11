import { Profile } from "@interfaces";
import "./graph.css";
import { Box } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { calculatePortfolioGrowthPerYear } from "@utils";

interface ProfilesGraphProps {
  profiles: Profile[];
  totalYears: number;
}

export const ProfilesGraph: React.FC<ProfilesGraphProps> = ({
  profiles,
  totalYears,
}) => {
  const profilesSeries = profiles.map((profile) => ({
    ...profile,
    data: calculatePortfolioGrowthPerYear(profile, totalYears),
  }));
  const currentYear = new Date().getFullYear();
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
      </Box>
    </>
  );
};
