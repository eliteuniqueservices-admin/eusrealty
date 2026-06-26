import RoiCalculatorClient from "@/components/RoiCalculatorClient";

export const metadata = {
  title: "Real Estate Investment ROI Dashboard | EUS Realty",
  description: "Calculate rental yields, projected capital gains, and compound interest returns for Pune real estate investments with zero brokerage.",
  alternates: {
    canonical: "https://eusrealty.co.in/calculator/roi",
  }
};

export default function RoiCalculatorPage() {
  return <RoiCalculatorClient />;
}
