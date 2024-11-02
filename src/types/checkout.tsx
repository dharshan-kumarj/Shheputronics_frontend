export interface CartItem {
    product_id: number;
    quantity: number;
    name: string;
    price: number;
    image: string;
    maxQuantity: number;
}

export interface Address {
    id: number;
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    isDefault: boolean;
}