'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './page.module.css';
import api from '@/services/api';

export default function CollectionsPage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await api.get('/categories');
        const data = Array.isArray(response.data) ? response.data : (response.data.data || []);

        const mappedCollections = data.map((cat, index) => {
          const stickers = ["NEW", "HOT", "SALE", "TREND"];
          const colors = ["pink", "black", "green"];

          return {
            id: cat.id,
            title: cat.name.toUpperCase(),
            subtitle: "Collection",
            desc: cat.description || "Peças únicas com preços incríveis.",
            image: cat.image || 'https://via.placeholder.com/600x800?text=COLLECTION',
            sticker: stickers[index % stickers.length],
            stickerColor: colors[index % colors.length]
          };
        });

        setCollections(mappedCollections);
      } catch (error) {
        console.error("Failed to fetch collections", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

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
        ) : collections.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', border: '2px dashed #000' }}>
            <h3 style={{ fontFamily: 'Oswald', fontSize: '2rem' }}>NENHUMA COLEÇÃO ENCONTRADA</h3>
          </div>
        ) : (
          collections.map((col) => (
            <Link href={`/shop?category=${col.title}`} key={col.id} className={styles.cardWrapper}>
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
                <div className={`${styles.sticker} ${styles[col.stickerColor]}`}>
                  {col.sticker}
                </div>

                <div className={styles.imageFrame}>
                  <img src={col.image} alt={col.title} />
                </div>

                <div className={styles.info}>
                  <div className={styles.titleGroup}>
                    <span className={styles.titleMain}>{col.title}</span>
                    <span className={styles.titleSub}>{col.subtitle}</span>
                  </div>
                  <div className={styles.divider}></div>
                  <p className={styles.colDesc}>{col.desc}</p>
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