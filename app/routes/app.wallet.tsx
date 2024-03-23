import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

import {
  Page,
  Layout,
  Card,
  BlockStack,
  FormLayout,
  Button,
  TextField,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { Form, json, redirect, useLoaderData } from "@remix-run/react";
import db from "../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(
    `#graphql
      query getShopUrl {
        shop {
    url
  }

      }`,
  );
  const responseJson = await response.json();
  const shopUrl = responseJson.data.shop.url;

  return json({
    shopUrl,
  });
};

export async function action({ request }: ActionFunctionArgs) {
  await authenticate.admin(request);

  const formData = await request.formData();

  // Validate the form data
  const wallet = formData.get("wallet") as string;
  const fid = formData.get("fid") as string;
  const shop = formData.get("shop") as string;
  if (!wallet || !fid) {
    throw new Error("Please fill out all fields");
  }
  await db.wallet.create({
    data: {
      shop,
      address: wallet,
      fid,
    },
  });
  // Redirect to dashboard if validation is successful
  return redirect("/app/frames");
}

export default function Wallet() {
  const { shopUrl } = useLoaderData<typeof loader>();
  return (
    <Page>
      <ui-title-bar title="Your wallet" />
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <Form method="post">
                <FormLayout>
                  <TextField
                    label="Farcaster ID"
                    id="fid"
                    name="fid"
                    autoComplete="off"
                  />
                  <TextField
                    label="Wallet Address"
                    id="wallet"
                    name="wallet"
                    autoComplete="off"
                  />
                  <input type="hidden" name="shop" value={shopUrl} />
                  <Button submit>Connect</Button>
                </FormLayout>
              </Form>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
