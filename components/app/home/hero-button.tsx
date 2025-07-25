// HeroButton.tsx
import { Button } from "@/components/ui/button";

export default function HeroButton() {
  const handleClick = () => {
    const section = document.getElementById("call-to-action");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex justify-center mt-8">
      <Button
        onClick={handleClick}
        className="rounded-full w-[163.37px] h-[52.42px] text-lg font-medium bg-white text-[#232323] hover:bg-gray-200 transition-colors cursor-pointer"
      >
        Join Waitlist
      </Button>
    </div>
  );
}
