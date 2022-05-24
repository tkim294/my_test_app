import { gql, useMutation } from "@apollo/client";
import {
  Modal,
  ResourceList,
  ResourceItem,
  Stack,
  TextStyle,
  Toast,
  Button,
  Thumbnail,
  Loading,
} from "@shopify/polaris";
import { useState } from "react";

const UPDATE_SKU = gql`
  mutation draftOrderUpdate($id: ID!, $input: DraftOrderInput!) {
    draftOrderUpdate(id: $id, input: $input) {
      draftOrder {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export function OrderDetails({ orderID, lineItems, toggleModal, modalActive, onUpdate }) {
  const [mutationFunction, { data, loading, error }] = useMutation(UPDATE_SKU);
  const [hasResults, setHasResults] = useState(false);
  if (loading) return <Loading />;

  if (error) {
    console.warn(error);
    return <Banner status='critical'>{error.message}</Banner>;
  }

  const toast = hasResults && (
    <Toast
      content='Successfully updated'
      onDismiss={() => setHasResults(false)}
    />
  );

  const SKUHandler = (lineItem) => {
    let promise = new Promise((resolve) => resolve());

    // let lineItem_id = lineItem.id;

    const updated_order = {
      "id": orderID,
      "input": {
        "lineItems": [
          {
            "variantId": lineItem.variant.id,
            "quantity": 3,
          },
        ],
      },
    };

    // mutationFunction({
    //     variables: {id: updated_order.id, input: updated_order.input}
    // })

    promise = promise
      .then(() =>
        mutationFunction({
          variables: { id: updated_order.id, input: updated_order.input },
        })
      )
      .catch((error) => {
        console.log(error);
      });

    if (promise) {
      promise.then(() => onUpdate().then(setHasResults(true)));
    }
  };

  return (
    <div>
    <Modal large open={modalActive} onClose={toggleModal} title='Order Details'>
        {toast}
      <Modal.Section>
        <ResourceList
          items={lineItems}
          renderItem={(item) => {
            const media = (
              <Thumbnail
                source={item.node.image ? item.node.image.url : ""}
                alt={item.node.image ? item.node.image.altText : ""}
              />
            );
            return (
              <ResourceItem id={item.node.id} media={media}>
                <Stack>
                  <Stack.Item>
                    <h3>
                      <TextStyle variation='strong'>
                        {item.node.title}
                      </TextStyle>
                    </h3>
                  </Stack.Item>
                  <Stack.Item>
                    <h3>
                      <TextStyle variation='subdued'>{item.node.sku}</TextStyle>
                    </h3>
                  </Stack.Item>
                  <Stack.Item>
                    <h3>
                      <TextStyle variation='subdued'>
                        {item.node.quantity}
                      </TextStyle>
                    </h3>
                  </Stack.Item>
                  <Stack.Item>
                    <p>${item.node.originalUnitPrice}</p>
                  </Stack.Item>
                  <Button onClick={() => SKUHandler(item.node)}>
                    Assign Random SKU
                  </Button>
                </Stack>
              </ResourceItem>
            );
          }}
        />
      </Modal.Section>
    </Modal>
    </div>
  );
}
