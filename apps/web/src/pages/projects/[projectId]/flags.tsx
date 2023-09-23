import { DashboardHeader } from "components/DashboardHeader";
import { Layout } from "components/Layout";
import { FullPageLoadingSpinner } from "components/LoadingSpinner";
import { useProjectId } from "lib/hooks/useProjectId";
import { NextPageWithLayout } from "pages/_app";
import { trpc } from "utils/trpc";

import { FeatureFlagPageContent } from "components/FlagPage";

const FeatureFlagsPage: NextPageWithLayout = () => {
  const projectId = useProjectId();

  const { data, isLoading, isError } = trpc.flags.getFlags.useQuery({
    projectId,
    types: ["BOOLEAN"],
  });

  if (isLoading || isError) return <FullPageLoadingSpinner />;

  return <FeatureFlagPageContent data={data} type="Flags" />;
};

FeatureFlagsPage.getLayout = (page) => (
  <Layout>
    <DashboardHeader title="Feature Flags" />
    {page}
  </Layout>
);

export default FeatureFlagsPage;
