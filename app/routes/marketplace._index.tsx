import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { unauthenticated } from "~/shopify.server";
import { Button } from "~/ui/button";

export async function loader() {
  const { storefront } = await unauthenticated.storefront(
    "quickstart-df6da22b.myshopify.com",
  );

  const response = await storefront.graphql(
    `#graphql
    query products {
      products(first: 3) {
        edges {
          node {
            id
            title
          }
        }
      }
    }`,
  );

  const data = await response.json();
  return json({ data });
}
export default function Home() {
  const { data } = useLoaderData<typeof loader>();
  console.log(data);
  return (
    <div>
      <h1>Marketplace</h1>
      <Button>Click me</Button>
    </div>
  );
}
