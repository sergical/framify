import { json } from "@remix-run/node";
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
import { Form, redirect, useLoaderData } from "@remix-run/react";
import db from "../db.server";
import { useState } from "react";

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

  const wallet = await db.wallet.findFirst({
    where: {
      shop: shopUrl,
    },
  });

  return json({
    shopUrl,
    wallet,
  });
};

export async function action({ request }: ActionFunctionArgs) {
  await authenticate.admin(request);

  const formData = await request.formData();

  // Validate the form data
  const walletAddress = formData.get("walletAddress") as string;
  const fid = formData.get("fid") as string;
  const shop = formData.get("shop") as string;
  const walletId = Number(formData.get("walletId"));
  if (!walletAddress || !fid) {
    throw new Error("Please fill out all fields");
  }
  await db.wallet.upsert({
    where: {
      id: walletId, // Assuming 'fid' is a unique identifier
    },
    update: {
      address: walletAddress,
      fid: fid,
    },
    create: {
      shop: shop,
      address: walletAddress,
      fid: fid,
    },
  });
  // Redirect to dashboard if validation is successful
  return redirect("/app/frames");
}

export default function Wallet() {
  const { shopUrl, wallet } = useLoaderData<typeof loader>();
  const [walletAddress, setWalletAddress] = useState(wallet?.address || "");
  const [fid, setFid] = useState(wallet?.fid || "");
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
                    value={fid}
                    onChange={(value) => setFid(value)}
                  />
                  <TextField
                    label="Wallet Address"
                    id="walletAddress"
                    name="walletAddress"
                    autoComplete="off"
                    value={walletAddress}
                    onChange={(value) => setWalletAddress(value)}
                  />
                  <input type="hidden" name="shop" value={shopUrl} />
                  <input type="hidden" name="walletId" value={wallet?.id} />
                  <Button submit>{wallet ? "Update" : "Connect"}</Button>
                </FormLayout>
              </Form>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
