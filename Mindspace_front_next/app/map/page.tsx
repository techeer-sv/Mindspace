import Loading from "@/components/MoonLoadSpinner";
import HydratedNode from "./hydratedNode";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <HydratedNode />
    </Suspense>
  );
}
