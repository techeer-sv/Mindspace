import Loading from "@/components/Loading";
import HydratedNode from "./hydratedNode";
import { Suspense } from "react";

export default function Page() {
  return (
    <main className="flex w-full">
      <Suspense fallback={<Loading />}>
        <HydratedNode />
      </Suspense>
    </main>
  );
}
