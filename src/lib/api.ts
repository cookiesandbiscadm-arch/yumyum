import { supabase } from './supabaseClient';

// Types
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string | null;
  full_image_url?: string | null;
  category_id?: string | null;
  nutrition_calories?: number | null;
  nutrition_sugar?: number | null;
  nutrition_protein?: number | null;
  display_order?: number | null;
}

export interface Category {
  id: string;
  name: string;
  slug?: string | null;
  emoji?: string | null;
  display_order?: number | null;
  is_active?: boolean | null;
}

// Simple in-memory + sessionStorage cache
const memoryCache: Record<string, { ts: number; data: any }> = {};
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

async function withRetry<T>(runner: () => Promise<T>, retries = 2, baseDelayMs = 300): Promise<T> {
  let lastErr: any;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await runner();
    } catch (err: any) {
      lastErr = err;
      // Retry on transient/network errors
      const msg = (err?.message || '').toLowerCase();
      const isTransient = msg.includes('fetch') || msg.includes('timeout') || msg.includes('network') || msg.includes('connect');
      if (attempt < retries && isTransient) {
        const delay = baseDelayMs * Math.pow(2, attempt);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }

      break;
    }
  }
  throw lastErr;
}

function getCached(key: string) {
  const now = Date.now();
  // memory first
  const mem = memoryCache[key];
  if (mem && now - mem.ts < CACHE_TTL_MS) return mem.data;
  // sessionStorage fallback
  try {
    const raw = sessionStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (now - parsed.ts < CACHE_TTL_MS) {
        memoryCache[key] = { ts: parsed.ts, data: parsed.data };
        return parsed.data;
      }
    }
  } catch {}
  return null;
}

function setCached(key: string, data: any) {
  const payload = { ts: Date.now(), data };
  memoryCache[key] = payload;
  try {
    sessionStorage.setItem(key, JSON.stringify(payload));
  } catch {}
}

// Categories fetch with lightweight cache (memory + sessionStorage)
const CATEGORIES_CACHE_KEY = 'categories_list_v1';

export async function fetchCategories(): Promise<Category[]> {
  const cacheKey = CATEGORIES_CACHE_KEY;
  const cached = getCached(cacheKey) as Category[] | null;
  if (cached) return cached;

  try {
    // Background revalidation
    withRetry(async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id,name,slug,emoji,display_order,is_active')
        .order('display_order', { ascending: true });
      if (error) throw error;
      setCached(cacheKey, data);
      return data as any;
    });
  } catch {
    /* ignore background errors */
  }

  const data = await withRetry(async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('id,name,slug,emoji,display_order,is_active')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data as any;
  });
  setCached(cacheKey, data);
  return data as Category[];
}

// Fetch products with images from Supabase view
// Fetch a single product by ID
export async function fetchProductById(id: string): Promise<Product> {
  const cacheKey = `product_${id}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  return withRetry(async () => {
    const { data, error } = await supabase
      .from('products_with_images')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    const product = data as Product;
    setCached(cacheKey, product);
    return product;
  });
}

export async function fetchProducts(): Promise<Product[]> {
  const cacheKey = 'products_list_v1';
  const cached = getCached(cacheKey) as Product[] | null;
  if (cached) {
    // Revalidate in background
    withRetry(async () => {
      const { data, error } = await supabase
        .from('products_with_images')
        .select('id,name,price,image_url,full_image_url,display_order,category_id')
        .order('display_order', { ascending: true });
      if (error) throw error;
      setCached(cacheKey, data);
      return data as any;
    }).catch(() => {});
    return cached as Product[];
  }

  const data = await withRetry(async () => {
    const { data, error } = await supabase
      .from('products_with_images')
      .select('id,name,price,image_url,full_image_url,display_order,category_id')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data as any;
  });
  setCached(cacheKey, data);
  return data as Product[];
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

  // 2. Calculate total amount
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // 2. Debug log for totalAmount
  console.log('totalAmount before insert:', totalAmount);
  console.log({
    customer_id,
    delivery_address: customer.address,
    total_amount: totalAmount
  });

  // 2. Insert order
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert([{ customer_id, delivery_address: customer.address, total_amount: totalAmount.toString() }])
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

