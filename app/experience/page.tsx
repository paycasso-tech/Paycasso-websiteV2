import { Metadata } from "next";
import EscrowExperience from "./components/EscrowExperience";

export const metadata: Metadata = {
  title: "Paycasso Experience - The Future of Payments",
  description: "Mind-blowing 60-second demo of web3 escrow payments",
};

export default function ExperiencePage() {
  return <EscrowExperience />;
}
