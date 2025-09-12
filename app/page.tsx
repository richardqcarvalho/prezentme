import Footer from "@/app/footer";

export default function Welcome() {
  return (
    <div className="flex flex-1 flex-col p-8">
      <span className="text-lg font-black">PrezentMe</span>
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <h1 className="text-6xl font-black uppercase">Showcase your skills</h1>
        <h2 className="text-xl">
          Create a beautiful presentation of what you have to who are interested
          on you
        </h2>
        <Footer />
      </div>
    </div>
  );
}
