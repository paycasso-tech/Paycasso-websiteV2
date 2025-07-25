import Image from "next/image";

export default function LogoSection() {
  return (
    <div className="flex items-center">
      <Image
        src="/logo.png"
        alt="Paycasso Logo"
        width={30}
        height={30}
        priority
        className="h-6 w-auto"
      />
    </div>
  );
}
