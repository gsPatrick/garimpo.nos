'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import ShopFilters from '@/components/ShopFilters/ShopFilters';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from './page.module.css';
import api from '@/services/api';

export default function ShopPage() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  const fetchProducts = useCallback(async (currentFilters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (currentFilters.category) params.append('category', currentFilters.category);
      if (currentFilters.minPrice) params.append('price_min', currentFilters.minPrice);
      if (currentFilters.maxPrice) params.append('price_max', currentFilters.maxPrice);
      if (currentFilters.size) params.append('size', currentFilters.size);
      if (currentFilters.color) params.append('color', currentFilters.color);

      const response = await api.get('/products', { params });

      const mappedProducts = response.data.data.map(p => ({
        id: p.id,
        name: p.name,
        price: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.price),
        category: p.category?.name || 'Streetwear',
        tag: p.is_new ? 'NEW' : (p.is_hot ? 'HOT' : null),
        imgFront: p.images?.[0] || 'https://via.placeholder.com/800x800?text=NO+IMAGE',
        imgBack: p.images?.[1] || p.images?.[0] || 'https://via.placeholder.com/800x800?text=NO+IMAGE'
      }));

      setProducts(mappedProducts);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(filters);
  }, [fetchProducts, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <main className={styles.main}>

      <section className={styles.shopHero}>
        <h1 className={styles.mixedTitle}>
          <span className={styles.wordSolid}>TODAS</span>
          <span className={styles.wordScript}>as</span>
          <span className={styles.wordOutline}>PEÇAS</span>
        </h1>
        <div className={styles.counterTag}>
          {products.length} ITENS DISPONÍVEIS
        </div>
      </section>

      <div className={styles.controls}>
        <button className={styles.filterToggle} onClick={() => setMobileFiltersOpen(true)}>
          <span className={styles.icon}>≡</span> FILTROS
        </button>
        <div className={styles.sortWrapper}>
          <span>ORDENAR POR:</span>
          <select className={styles.sortSelect}>
            <option>MAIS NOVOS</option>
            <option>MENOR PREÇO</option>
          </select>
        </div>
      </div>

      <div className={styles.container}>
        <ShopFilters
          mobileOpen={mobileFiltersOpen}
          closeMobile={() => setMobileFiltersOpen(false)}
          onFilterChange={handleFilterChange}
        />

        <motion.div
          className={styles.productGrid}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        >
          {loading ? (
            // SKELETON GRID
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{
                height: '400px',
                background: '#f0f0f0',
                border: '2px solid #000',
                boxShadow: '4px 4px 0px #000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontFamily: 'Oswald', fontSize: '1.5rem', opacity: 0.5, animation: 'pulse 1s infinite' }}>LOADING...</span>
              </div>
            ))
          ) : products.length === 0 ? (
            // EMPTY STATE
            <div style={{
              gridColumn: '1 / -1',
              border: '2px dashed #000',
              padding: '60px',
              textAlign: 'center',
              background: '#fff'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>:(</div>
              <h3 style={{ fontFamily: 'Oswald', fontSize: '2.5rem', marginBottom: '10px' }}>GARIMPANDO NOVIDADES...</h3>
              <p style={{ fontSize: '1.2rem' }}>Não encontramos nada com esses filtros. Tente buscar outra coisa!</p>
              <button
                onClick={() => handleFilterChange({ category: '', minPrice: '', maxPrice: '' })}
                style={{
                  marginTop: '20px',
                  padding: '10px 20px',
                  background: '#000',
                  color: '#fff',
                  border: 'none',
                  fontFamily: 'Oswald',
                  cursor: 'pointer'
                }}
              >
                LIMPAR FILTROS
              </button>
            </div>
          ) : (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </motion.div>

        {mobileFiltersOpen && (
          <div className={styles.overlay} onClick={() => setMobileFiltersOpen(false)} />
        )}
      </div>
    </main>
  );
}