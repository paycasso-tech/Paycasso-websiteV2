import Image from "next/image";

export default function HeroImage() {
  return (
    <div className="mx-auto mt-12 flex justify-center items-center w-[1061px] h-[610px] rounded-[20px] border border-[#FAFAFA75] bg-[#9292920A] shadow-[0_4px_4px_0_#2323237D,1px_4px_17.1px_0_#FFFFFF0A_inset] p-[19px] py-2 gap-[10px]">
      <Image
        src="/demo2.svg"
        alt="Demo"
        width={1023}
        height={665}
        className="rounded-[20px]"
        priority
      />
    </div>
  );
}
