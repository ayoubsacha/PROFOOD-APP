import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import {
  PRODUCT_CATALOG,
  ProductCatalogItem,
  findProductBySlug,
} from '../models/product-catalog.models';
import { API_BASE_URL } from './api.config';
import { ApiResponse, BackendProduct } from './api.models';

@Injectable({ providedIn: 'root' })
export class ProductApiService {
  private readonly http = inject(HttpClient);

  getProducts(): Observable<ProductCatalogItem[]> {
    return this.http.get<ApiResponse<BackendProduct[]>>(`${API_BASE_URL}/products`).pipe(
      map((response) => {
        const products = response.data.map((product) => this.toCatalogItem(product));
        return products.length ? products : PRODUCT_CATALOG;
      }),
      catchError(() => of(PRODUCT_CATALOG)),
    );
  }

  getProduct(identifier: string): Observable<ProductCatalogItem | undefined> {
    return this.http.get<ApiResponse<BackendProduct>>(`${API_BASE_URL}/products/${identifier}`).pipe(
      map((response) => this.toCatalogItem(response.data)),
      catchError(() => of(findProductBySlug(identifier))),
    );
  }

  private toCatalogItem(product: BackendProduct): ProductCatalogItem {
    const characteristics = product.characteristics ?? {};
    const list = Object.entries(characteristics)
      .filter(([, value]) => value !== null && value !== undefined && value !== '')
      .map(([key, value]) => `${this.labelize(key)}: ${this.stringify(value)}`);
    const unit = String(characteristics['unit'] || 'unite');
    const minimumQuantity = Number(characteristics['minimumQuantity'] || 1);
    const maximumQuantity = Math.max(Number(product.stockQuantity || 1), minimumQuantity);
    const type = product.type || product.status;

    return {
      id: product._id,
      slug: product.slug || product._id,
      name: product.name,
      family: product.category,
      imageUrl: product.image || '/assets/business-hero.png',
      imageAlt: product.name,
      priceMad: product.price,
      unit,
      minimumQuantity,
      maximumQuantity,
      quantityStep: Number(characteristics['quantityStep'] || 1),
      rating: 4.5,
      ratingCount: 0,
      supplier: {
        name: product.fournisseurName,
        location: String(characteristics['location'] || ''),
        phone: String(characteristics['phone'] || ''),
        email: String(characteristics['email'] || ''),
      },
      characteristics: list.length ? list : [type, `${product.stockQuantity} en stock`],
      cardCharacteristics: [type, `${product.stockQuantity} en stock`],
      description: String(
        characteristics['description'] ||
          `${product.name} disponible pour commandes professionnelles.`,
      ),
    };
  }

  private labelize(value: string): string {
    return value.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase());
  }

  private stringify(value: unknown): string {
    return typeof value === 'object' ? JSON.stringify(value) : String(value);
  }
}
