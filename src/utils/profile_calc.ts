import { Profile } from "@interfaces";
import Big from "big.js";

export const calculatePortfolioGrowthPerYear = (
  profile: Profile,
  totalYears: number,
  annualGrowthRate: number | Big
) => {
  const startingAmount = new Big(profile.startingAmount);
  const monthlyContributionBase = new Big(profile.monthlyContribution);
  annualGrowthRate = new Big(annualGrowthRate);
  const totalMonths = totalYears * 12;
  const monthlyGrowthRate = annualGrowthRate.div(12);

  let portfolio = startingAmount;
  const portfolioStats = [];

  for (let currentMonth = 0; currentMonth < totalMonths; currentMonth++) {
    let monthlyContribution = monthlyContributionBase;
    if (currentMonth % 12 === 0) {
      // console.log(
      //   `Plan ${name} - Year #${currentMonth / 12}: ${Math.floor(
      //     portfolio.toNumber()
      //   )}`
      // );
      portfolioStats.push(portfolio.toNumber());
    }
    portfolio = portfolio.plus(portfolio.times(monthlyGrowthRate)); // Apply monthly growth
    if (profile.loan) {
      const loan = profile.loan;
      if (loan.months >= currentMonth) {
        monthlyContribution = monthlyContribution.sub(loan.monthlyPayout);
      }
    }
    portfolio = portfolio.plus(monthlyContribution); // Add yearly contribution
  }
  portfolioStats.push(portfolio.toNumber());
  return portfolioStats;
};
