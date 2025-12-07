'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './CategoryCarousel.module.css';
import api from '@/services/api';

export default function CategoryCarousel() {
  const carouselRef = useRef();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        // Se a API retornar array direto ou { data: [...] }
        const data = Array.isArray(response.data) ? response.data : (response.data.data || []);

        const mappedCategories = data.map(cat => {
          let img = cat.image || 'https://via.placeholder.com/800x800?text=NO+IMAGE';

          // Fix específico para JACKETS que está sem imagem
          if (cat.name === 'JACKETS' || cat.name === 'Jackets') {
            img = 'https://images.unsplash.com/photo-1559563458-527698bf5295?q=80&w=1000&auto=format&fit=crop';
          }

          return {
            id: cat.id,
            name: cat.name,
            sub: cat.description || 'Ver coleção',
            img: img
          };
        });

        setCategories(mappedCategories);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // --- LOADING STATE (SKELETON) ---
  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.header}>
          <h2 className={styles.title}>CARREGANDO <span className={styles.scriptHighlight}>Vibe...</span></h2>
        </div>
        <div className={styles.carouselContainer}>
          <div className={styles.track} style={{ gap: '20px', display: 'flex', overflow: 'hidden' }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{
                minWidth: '280px',
                height: '380px',
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
        </div>
      </section>
    );
  }

  // --- EMPTY STATE ---
  if (categories.length === 0) {
    return (
      <section className={styles.section}>
        <div className={styles.header}>
          <h2 className={styles.title}>SEM <span className={styles.scriptHighlight}>Vibes</span> NO MOMENTO</h2>
        </div>
        <div className={styles.emptyBanner} style={{
          border: '2px dashed #000',
          padding: '40px',
          textAlign: 'center',
          margin: '0 20px',
          background: '#fff'
        }}>
          <h3 style={{ fontFamily: 'Oswald', fontSize: '2rem' }}>GARIMPANDO NOVIDADES...</h3>
          <p>Volte em breve para conferir os novos drops.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          ESCOLHA SUA <span className={styles.scriptHighlight}>Vibe</span>
        </h2>
        <div className={styles.arrows}>
          <span>← ARRASTE PARA O LADO →</span>
        </div>
      </div>

      <div className={styles.carouselContainer} ref={carouselRef}>
        <motion.div
          className={styles.track}
          drag="x"
          dragConstraints={carouselRef}
        >
          {categories.map((cat) => (
            <Link href={`/shop?category=${cat.name}`} key={cat.id} className={styles.cardLink}>
              <motion.div
                className={styles.card}
                whileHover={{ y: -10, rotate: 2 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.imageWrapper}>
                  <div className={styles.overlay} />
                  <img src={cat.img} alt={cat.name} />

                  <div className={styles.cardContent}>
                    <span className={styles.sub}>{cat.sub}</span>
                    <h3 className={styles.catName}>{cat.name}</h3>
                    <span className={styles.btn}>
                      VER PEÇAS
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}