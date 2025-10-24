'use client';

import useSWR from 'swr';
import { getProducts, getProduct } from '../lib/api';

const fetcher = (path) => {
  if (path.startsWith('/api/products/') && path.split('/').length === 4) {
    const id = path.split('/')[3];
    return getProduct(id);
  }
  return getProducts();
};

export const useProducts = () => {
  const { data, error, isLoading } = useSWR('/api/products', getProducts);
  return {
    products: data || [],
    isLoading,
    error
  };
};

export const useProduct = (id) => {
  const { data, error, isLoading } = useSWR(id ? `/api/products/${id}` : null, () => getProduct(id));
  return {
    product: data,
    isLoading,
    error
  };
};
