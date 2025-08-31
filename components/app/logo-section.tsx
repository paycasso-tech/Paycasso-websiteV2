import Image from "next/image";

export default function LogoSection() {
  return (
    <div className="flex items-center cursor-pointer" onClick={() => window.location.href = "/"}>
      <Image
        src="/logo.png"
        alt="Paycasso Logo"
        width={40}
        height={40}
        priority
        className="h-6 w-auto"
      />
    </div>
  );
}
