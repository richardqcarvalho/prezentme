import Footer from "@/app/footer";
import { H1, H3, H4 } from "@/components/typography";

export default function Home() {
  return (
    <div className="flex h-svh w-svw flex-col">
      <div className="bg-sidebar-primary fixed flex w-full px-8 py-4">
        <div className="flex">
          <H4 className="text-sidebar">PrezentMe</H4>
        </div>
      </div>
      <div className="flex h-full flex-col items-center justify-center">
        <div className="flex max-w-3/4 flex-col justify-start gap-4">
          <H1>Showcase your skills</H1>
          <H3>
            Create a beautiful presentation of what you have to who are
            interested on you
          </H3>
          <Footer />
        </div>
      </div>
    </div>
  );
}
