import { dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/api/utils/getQueryClient";
import { getNodeListSSR } from "@/api/nodeServer";
import { NODE_QUERIES } from "@/constants/queryKeys";
import HydrateOnClient from "@/api/utils/hydrateOnClient";
import dynamic from "next/dynamic";

export default async function HydratedNode() {
  const MapPage = dynamic(() => import("./map"), {
    ssr: false,
  });

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery([NODE_QUERIES.LIST], getNodeListSSR);
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrateOnClient state={dehydratedState}>
      <MapPage />
    </HydrateOnClient>
  );
}
