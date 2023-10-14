import { dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/getQueryClient";
import { getNodeListSSR } from "@/api/nodeServer";
import { NODE_QUERIES } from "@/constants/queryKeys";
import MapPage from "./map";
import HydrateOnClient from "@/hydrateOnClient";

export default async function HydratedNode() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery([NODE_QUERIES.LIST], getNodeListSSR);

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrateOnClient state={dehydratedState}>
      <MapPage />
    </HydrateOnClient>
  );
}
