import { supabase } from './supabaseClient';

// Fetch products with images from Supabase view
export async function fetchProducts() {
  const { data, error } = await supabase
    .from('products_with_images')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data;
}

// Fetch categories from Supabase
export async function fetchCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data;
}

// Submit order to Supabase
export async function submitOrder({ customer, items }: {
  customer: { name: string; phone: string; address: string };
  items: Array<{ id: string; name: string; price: number; quantity: number }>;
}) {
  // 1. Insert customer
  const { data: customerData, error: customerError } = await supabase
    .from('customers')
    .insert([{ name: customer.name, phone: customer.phone, address: customer.address }])
    .select('id')
    .single();
  if (customerError) throw customerError;
  const customer_id = customerData.id;

  // 2. Insert order
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert([{ customer_id, delivery_address: customer.address }])
    .select('id, order_number')
    .single();
  if (orderError) throw orderError;
  const order_id = orderData.id;
  const order_number = orderData.order_number;

  // 3. Insert order_items
  const orderItemsPayload = items.map(item => ({
    order_id,
    product_id: item.id,
    product_name: item.name,
    unit_price: item.price,
    quantity: item.quantity,
    total_price: item.price * item.quantity
  }));
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsPayload);
  if (itemsError) throw itemsError;

  return { order_number };
}

