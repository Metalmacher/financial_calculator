export const shekelSign = "₪";
export interface Loan {
  monthlyPayout: number;
  months: number;
}
export interface Profile {
  name: string;
  startingAmount: number;
  monthlyContribution: number;
  color: string;
  loan?: Loan;
  // You can add more properties as needed
}

export interface ProfileSeries {
    data: number[];
    name: string;
    startingAmount: number;
    monthlyContribution: number;
    color: string;
    loan?: Loan;
}

export interface ProfilesSummary {
    totalYears: number;
    annualGrowthRate: number;
    profiles: ProfileSeries[]
}