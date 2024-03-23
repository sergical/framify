import { json } from "@remix-run/node";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

import {
  Page,
  Layout,
  BlockStack,
  IndexTable,
  useIndexResourceState,
  Thumbnail,
  Text,
  Badge,
  LegacyCard,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import { useLoaderData, useSubmit } from "@remix-run/react";

type Product = {
  id: number;
  fid: string;
  shop: string;
  name: string;
  address: string;
  imageUrl: string;
  checkoutUrl: string;
  price: number;
  frameId?: number;
};
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(
    `#graphql
    query getFrames {
      shop {
        url
      }
      products(first: 10, reverse: true) {
        edges {
          node {
            id
            title
            handle
            priceRangeV2 {
              maxVariantPrice{
                amount
              }
            }
            onlineStorePreviewUrl
            featuredImage {
              url
            }
            resourcePublicationOnCurrentPublication {
              publication {
                name
                id
              }
              publishDate
              isPublished
            }
          }
        }
      }
    }`,
  );

  const jsonData = await response.json();
  const shopUrl = jsonData.data.shop.url;
  const wallet = await db.wallet.findFirst({
    where: {
      shop: shopUrl,
    },
  });

  const frames = await db.frame.findMany({
    where: {
      shop: shopUrl,
    },
  });

  const products: Product[] = jsonData.data.products.edges.map((edge: any) => ({
    id: edge.node.id,
    fid: wallet?.fid,
    shop: shopUrl,
    name: edge.node.title,
    address: wallet?.address,
    imageUrl: edge.node.featuredImage?.url || "",
    checkoutUrl: edge.node.onlineStorePreviewUrl,
    price: parseFloat(edge.node.priceRangeV2.maxVariantPrice.amount),
    frameId:
      frames.find(
        (frame) => frame.checkoutUrl === edge.node.onlineStorePreviewUrl,
      )?.id || null,
  }));

  return json({
    products,
  });
};

export async function action({ request }: ActionFunctionArgs) {
  await authenticate.admin(request);

  const formData = await request.formData();

  const products: Product[] = JSON.parse(formData.get("products") as string);
  console.log("products", products);
  for (const product of products) {
    await db.frame.upsert({
      where: {
        checkoutUrl: product.checkoutUrl,
      },
      update: {
        shop: product.shop,
        name: product.name,
        address: product.address,
        imageUrl: product.imageUrl,
        price: product.price,
      },
      create: {
        fid: product.fid,
        checkoutUrl: product.checkoutUrl,
        shop: product.shop,
        name: product.name,
        address: product.address,
        imageUrl: product.imageUrl,
        price: product.price,
      },
    });
  }

  // Redirect to dashboard if validation is successful
  return json({ success: true });
}

export default function Frames() {
  const submit = useSubmit();

  const { products } = useLoaderData<typeof loader>();
  console.log(products);

  const resourceName = {
    singular: "frame",
    plural: "frames",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(products);

  const promotedBulkActions = [
    {
      content: "Create frame",
      onAction: () => {
        const data = new FormData();
        const selectedProducts = selectedResources.map((id) =>
          products.find((product) => product.id.toString() === id),
        );

        data.append("products", JSON.stringify(selectedProducts));

        submit(data, {
          method: "POST",
        });
      },
    },
  ];

  const rowMarkup = products.map(
    ({ id, name, address, imageUrl, frameId, price }, index) => (
      <IndexTable.Row
        id={id.toString()}
        key={id}
        selected={selectedResources.includes(id.toString())}
        position={index}
      >
        <IndexTable.Cell>
          <Thumbnail source={imageUrl} alt={name} />
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {name}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text as="span" numeric>
            ${price.toFixed(2)}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text as="span" numeric>
            0.01
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text as="span" alignment="end" numeric>
            <Badge>{frameId ? "Frame exists" : "No frame"}</Badge>
          </Text>
        </IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  return (
    <Page>
      <ui-title-bar title="Your frames" />
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <LegacyCard>
              <IndexTable
                resourceName={resourceName}
                itemCount={products.length}
                selectedItemsCount={
                  allResourcesSelected ? "All" : selectedResources.length
                }
                onSelectionChange={handleSelectionChange}
                promotedBulkActions={promotedBulkActions}
                headings={[
                  { title: "Image" },
                  { title: "Name" },
                  { title: "Price" },
                  { title: "ETH Price" },
                  { title: "Frame", alignment: "end" },
                ]}
              >
                {rowMarkup}
              </IndexTable>
            </LegacyCard>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
