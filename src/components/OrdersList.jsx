import {
  ResourceList,
  TextStyle,
  Stack,
  ResourceItem,
  Frame,
  Card,
} from "@shopify/polaris";
import { useCallback, useState } from "react";
import { OrderDetails } from "./OrderDetails";

export function OrdersList({ orders, onUpdate }) {
  const [modalActive, setModalActive] = useState(false);
  const [lineItems, setLineItems] = useState([]);
  const [orderID, setOrderID] = useState();

  const toggleModal = useCallback(() => setModalActive(!modalActive),[modalActive]);

  const showOrderDetail = (lineItems, id) => {
    setModalActive(true);
    setLineItems(lineItems.edges);
    setOrderID(id);
  }
  
  return (
    <div>
        {modalActive && <OrderDetails orderID={orderID} lineItems={lineItems} toggleModal={toggleModal} modalActive={modalActive} onUpdate={onUpdate} />}
        <ResourceList
        showHeader
        resourceName={{ singular: "Order", plural: "Orders" }}
        items={orders}
        renderItem={(item, index) => {
            const { id, name, subtotalPrice, lineItems } = item.node;
            return (
                <ResourceItem id={id} accessibilityLabel={`View details for ${name}`} onClick={() => {showOrderDetail(lineItems, id)}}>
                    <Stack>
                        <Stack.Item>
                            <h3>
                            <TextStyle variation='strong'>{name}</TextStyle>
                            </h3>
                        </Stack.Item>
                        <Stack.Item>
                            <p>${subtotalPrice}</p>
                        </Stack.Item>
                    </Stack>
                </ResourceItem>
            );
        }}
        />
    </div>
  );
}
