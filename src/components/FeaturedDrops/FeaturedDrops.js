'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../ProductCard/ProductCard';
import styles from './FeaturedDrops.module.css';
import Link from 'next/link';
import api from '@/services/api';

// Variantes para animação em cascata (stagger)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2 // Cada filho aparece 0.2s depois do anterior
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export default function FeaturedDrops() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        // Busca produtos destacados (is_featured=true)
        const response = await api.get('/products', {
          params: { is_featured: true, limit: 4 }
        });

        // Mapeia para o formato do componente
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
        console.error("Failed to fetch featured drops", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.header}>
          <h2 className={styles.title}>A MODA DO <span className={styles.outline}>MOMENTO</span></h2>
        </div>
        <div className={styles.grid}>
          {[1, 2, 3, 4].map((i) => (
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
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className={styles.section}>
        <div className={styles.header}>
          <h2 className={styles.title}>A MODA DO <span className={styles.outline}>MOMENTO</span></h2>
        </div>
        <div style={{
          border: '2px dashed #000',
          padding: '40px',
          textAlign: 'center',
          background: '#fff',
          margin: '20px 0'
        }}>
          <h3 style={{ fontFamily: 'Oswald', fontSize: '2rem' }}>SEM DROPS NO MOMENTO</h3>
          <p>Estamos preparando novidades quentes. Fique ligado!</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>A MODA DO  <span className={styles.outline}>MOMENTO</span></h2>
        <Link href="/shop" className={styles.viewAll}>
          VER TUDO →
        </Link>
      </div>

      <motion.div
        className={styles.grid}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {products.map((product) => (
          <motion.div key={product.id} variants={cardVariants}>
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}