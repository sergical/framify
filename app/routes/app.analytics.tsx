import type { LoaderFunctionArgs } from "@remix-run/node";

import { Page, Layout, Card, BlockStack } from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return null;
};

export default function Analytics() {
  return (
    <Page>
      <ui-title-bar title="Analytics" />
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>Account</Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
