export default function SectionUnderlineLabel({ title }: { title: string }) {
  return (
    <div className="w-full flex flex-col justify-center items-center my-5  md:my-10">
      <h1 className="mb-5 text-white text-3xl pb-3 md:pb md:text-4xl lg:text-5xl font-medium w-full text-center">
        {title}
      </h1>
      <div
        className="w-full max-w-4xl h-[1.5px]"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(129,154,255,0.35) 50%, rgba(255,255,255,0) 100%)",
        }}
      />
    </div>
  );
}
