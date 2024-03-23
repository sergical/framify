import type { LoaderFunctionArgs } from "@remix-run/node";

import { Page, Layout, Card, BlockStack, EmptyState } from "@shopify/polaris";
import { authenticate } from "../shopify.server";

import logo from "../images/logo.png";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return null;
};

export default function Index() {
  return (
    <Page>
      <ui-title-bar title="Framify" />
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <EmptyState
                heading="Sell your products on Farcaster"
                action={{ content: "Get started", url: "/app/wallet" }}
                image={logo}
                fullWidth
              >
                <ol>
                  <li>1. Connect your wallet</li>
                  <li>2. Publish your Frame</li>
                  <li>3. Stay Based</li>
                </ol>
              </EmptyState>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
