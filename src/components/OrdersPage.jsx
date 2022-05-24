import { gql, useQuery } from "@apollo/client";
import { Page, Layout, Banner, Card, Frame } from "@shopify/polaris";
import { Loading } from "@shopify/app-bridge-react";
import { OrdersList } from "./OrdersList";

// Get all orders
const GET_ALL_ORDERS = gql`
  {
    draftOrders(first: 20, query: "created_at:>2022-05-10") {
      edges {
        node {
          id
          name
          subtotalPrice
          lineItems(first: 10) {
            edges {
              node {
                id
                title
                sku
                quantity
                originalUnitPrice
                variant{
                    id
                }
                image {
                  id
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`;

export function OrdersPage() {
  const { loading, data, error, refetch } = useQuery(GET_ALL_ORDERS);

  if (loading) return <Loading />;

  if (error) {
    console.warn(error);
    return (
      <Banner status='critical'>There was an issue loading orders.</Banner>
    );
  }

  return (
    <Frame>
        <Page>
        <Layout>
            <Layout.Section>
            <Card>
                <OrdersList orders={data.draftOrders.edges} onUpdate={refetch} />
            </Card>
            </Layout.Section>
        </Layout>
        </Page>
    </Frame>
  );
}
