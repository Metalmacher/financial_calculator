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
