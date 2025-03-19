export type ElementStatus = "PURCHASED" | "DELIVERED"

export interface ShoppingElement {
    id: number;
    shoppingListId: number;
    gatewayId: number;
    name: string;
    quantity: number;
    status: ElementStatus;
}