'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './page.module.css';
import api from '@/services/api';

export default function CollectionsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('CATEGORIAS'); // CATEGORIAS or MARCAS

  useEffect(() => {
    fetchData();
  }, [filterType]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let endpoint = filterType === 'CATEGORIAS' ? '/categories' : '/brands';
      const response = await api.get(endpoint);
      const data = Array.isArray(response.data) ? response.data : (response.data.data || []);

      const mappedItems = data.map((item, index) => {
        const stickers = ["NEW", "HOT", "SALE", "TREND"];
        const colors = ["pink", "black", "green"];

        const rawImage = filterType === 'CATEGORIAS' ? item.image : item.logo;
        const imageUrl = rawImage
          ? (rawImage.startsWith('http') ? rawImage : `https://geral-tiptagapi.r954jc.easypanel.host${rawImage}`)
          : 'https://via.placeholder.com/600x800?text=IMAGE';

        return {
          id: item.id,
          title: item.name.toUpperCase(),
          subtitle: filterType === 'CATEGORIAS' ? "Collection" : "Brand",
          desc: item.description || (filterType === 'CATEGORIAS' ? "Peças únicas com preços incríveis." : "As melhores marcas do mercado."),
          image: imageUrl,
          sticker: stickers[index % stickers.length],
          stickerColor: colors[index % colors.length],
          type: filterType
        };
      });

      setItems(mappedItems);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>

      {/* Background Grid (Caderno) */}
      <div className={styles.bgGrid}></div>

      {/* HEADER */}
      <section className={styles.header}>
        <h1 className={styles.pageTitle}>
          <span className={styles.wordSolid}>NOSSAS</span>
          <span className={styles.wordScript}>Coleções</span>
        </h1>
        <p className={styles.description}>
          Explore nossos universos. Do <strong>Outlet</strong> ao <strong>Hype</strong>.
        </p>

        {/* FILTER TOGGLE */}
        <div className={styles.filterContainer}>
          <button
            onClick={() => setFilterType('CATEGORIAS')}
            className={`${styles.filterBtn} ${filterType === 'CATEGORIAS' ? styles.filterBtnActive : ''}`}
          >
            CATEGORIAS
          </button>
          <button
            onClick={() => setFilterType('MARCAS')}
            className={`${styles.filterBtn} ${filterType === 'MARCAS' ? styles.filterBtnActive : ''}`}
          >
            MARCAS
          </button>
        </div>
      </section>

      {/* GRID RETO */}
      <div className={styles.grid}>
        {loading ? (
          // SKELETON
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{
              height: '500px',
              background: '#f0f0f0',
              border: '2px solid #000',
              boxShadow: '15px 15px 0px #000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontFamily: 'Oswald', fontSize: '1.5rem', opacity: 0.5, animation: 'pulse 1s infinite' }}>LOADING...</span>
            </div>
          ))
        ) : items.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', border: '2px dashed #000' }}>
            <h3 style={{ fontFamily: 'Oswald', fontSize: '2rem' }}>NENHUM ITEM ENCONTRADO</h3>
          </div>
        ) : (
          items.map((item) => (
            <Link
              href={item.type === 'CATEGORIAS' ? `/shop?category=${item.title}` : `/shop?brand=${item.title}`}
              key={item.id}
              className={styles.cardWrapper}
            >
              <motion.div
                className={styles.posterCard}
                whileHover={{ y: -10, boxShadow: "15px 15px 0px #eb68b3" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Fita Adesiva Reta */}
                <div className={styles.tape}></div>

                {/* Sticker Reto */}
                <div className={`${styles.sticker} ${styles[item.stickerColor]}`}>
                  {item.sticker}
                </div>

                <div className={styles.imageFrame}>
                  <img src={item.image} alt={item.title} className="object-cover w-full h-full" />
                </div>

                <div className={styles.info}>
                  <div className={styles.titleGroup}>
                    <span className={styles.titleMain}>{item.title}</span>
                    <span className={styles.titleSub}>{item.subtitle}</span>
                  </div>
                  <div className={styles.divider}></div>
                  <p className={styles.colDesc}>{item.desc}</p>
                  <button className={styles.viewBtn}>EXPLORAR</button>
                </div>

              </motion.div>
            </Link>
          ))
        )}
      </div>

      {/* EM BREVE */}
      <section className={styles.comingSoon} style={{ marginTop: '60px' }}>
        <div className={styles.dashedBorder} style={{
          border: '2px dashed #000',
          padding: '60px',
          textAlign: 'center',
          background: '#fff',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)',
            background: '#000', color: '#fff', padding: '5px 20px', fontFamily: 'Oswald', fontSize: '0.9rem'
          }}>
            SPOILER ALERT
          </div>
          <h3 className={styles.soonTitle} style={{ fontFamily: 'Oswald', fontSize: '3rem', marginBottom: '10px' }}>EM BREVE...</h3>
          <p style={{ fontSize: '1.2rem', maxWidth: '500px', margin: '0 auto' }}>
            Novos drops estão sendo garimpados. Colabs exclusivas e peças raras chegando.
          </p>
        </div>
      </section>

    </main>
  );
}