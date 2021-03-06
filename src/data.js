// @flow
import type { ProductType, Product24HrStatsType } from './types'
import { API_URL } from './config'

type OnUpdateType = (stats: Array<Product24HrStatsType>) => void

export async function fetchData(onUpdate: OnUpdateType = () => {}): Promise<Array<Product24HrStatsType>> {
  const products: Array<ProductType> = await fetchProducts()
  const stats: Array<Product24HrStatsType> = []

  for (const product of products) {
    const productStats = await fetchProduct24HrStats(product)
    stats.push(productStats)
    onUpdate(stats)
  }

  return stats
}

async function fetchProducts(): Promise<Array<ProductType>> {
  const response = await fetch(`${API_URL}/products`)

  if (response.status !== 200) {
    throw new Error('Request to fetch products has failed.')
  }

  return response.json()
}

async function fetchProduct24HrStats(product: ProductType) {
  const response = await fetch(`${API_URL}/products/${product.id}/stats`)

  if (response.status !== 200) {
    throw new Error('Request to fetch product stats has failed.')
  }

  const responseJson = await response.json()
  const productStats = { id: product.id, ...responseJson }
  return productStats
}
