export const shekelSign = "₪";
export interface Loan {
  monthlyPayout: number;
  months: number;
}
export interface Profile {
  name: string;
  id?: number;
  startingAmount: number;
  monthlyContribution: number;
  annualGrowthRate: number;
  color: string;
  loan?: Loan;
  // You can add more properties as needed
}
