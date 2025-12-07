'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './page.module.css';
import api from '@/services/api';

export default function LookbookPage() {
  const [looks, setLooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLooks = async () => {
      try {
        const response = await api.get('/products', { params: { is_accessory: true } });
        const data = response.data.data || [];

        const mappedLooks = data.map((prod, index) => {
          const colors = ["pink", "black"];
          // Split name for title effect if possible
          const nameParts = prod.name.split(' ');
          const title = nameParts[0] || "LOOK";
          const subtitle = nameParts.slice(1).join(' ') || "Style";

          const rawImg = prod.images?.[0]?.src;
          const mainImg = rawImg
            ? (rawImg.startsWith('http') ? rawImg : `https://geral-tiptagapi.r954jc.easypanel.host${rawImg}`)
            : 'https://via.placeholder.com/800x800?text=LOOK';

          return {
            id: prod.id,
            title: title.toUpperCase(),
            subtitle: subtitle,
            desc: prod.description || "Acessório essencial para compor seu visual.",
            mainImg: mainImg,
            products: [
              { name: prod.name, price: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(prod.price) }
            ],
            sticker: "FRESH",
            color: colors[index % colors.length]
          };
        });

        setLooks(mappedLooks);
      } catch (error) {
        console.error("Failed to fetch looks", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLooks();
  }, []);

  return (
    <main className={styles.main}>

      <div className={styles.bgGrid}></div>

      {/* HERO DO LOOKBOOK */}
      <section className={styles.hero}>
        <div className={styles.badge}>★ EDITORIAL 2025</div>
        <h1 className={styles.title}>
          <span className={styles.wordSolid}>USE &</span>
          <span className={styles.wordScript}>Abuse</span>
        </h1>
        <p className={styles.intro}>
          Acessórios não são detalhe. São o <strong>protagonista</strong>.
        </p>
      </section>

      {/* LISTA DE LOOKS (Estilo Revista) */}
      <div className={styles.lookbookContainer}>
        {loading ? (
          // SKELETON
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{
              height: '600px',
              background: '#f0f0f0',
              border: '2px solid #000',
              marginBottom: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontFamily: 'Oswald', fontSize: '1.5rem', opacity: 0.5, animation: 'pulse 1s infinite' }}>LOADING LOOKS...</span>
            </div>
          ))
        ) : looks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', border: '2px dashed #000' }}>
            <h3 style={{ fontFamily: 'Oswald', fontSize: '2rem' }}>NENHUM LOOK ENCONTRADO</h3>
          </div>
        ) : (
          looks.map((look, index) => (
            <section key={look.id} className={`${styles.lookSection} ${index % 2 !== 0 ? styles.inverted : ''}`}>

              {/* LADO DA FOTO (Polaroid Gigante) */}
              <div className={styles.imageCol}>
                <motion.div
                  className={styles.polaroidFrame}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className={styles.tape}></div>
                  <img src={look.mainImg} alt={look.title} className={styles.lookImg} />

                  {/* Sticker na foto */}
                  <div className={`${styles.sticker} ${styles[look.color]}`}>
                    {look.sticker}
                  </div>
                </motion.div>
              </div>

              {/* LADO DO CONTEÚDO */}
              <div className={styles.infoCol}>
                <motion.div
                  initial={{ opacity: 0, x: index % 2 !== 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <h2 className={styles.lookTitle}>
                    <span className={styles.blockTitle}>{look.title}</span>
                    <span className={styles.scriptTitle}>{look.subtitle}</span>
                  </h2>

                  <p className={styles.lookDesc}>{look.desc}</p>

                  {/* Lista de Produtos no Look */}
                  <div className={styles.productList}>
                    <h3 className={styles.listHeader}>NESTE LOOK:</h3>
                    {look.products.map((prod, i) => (
                      <div key={i} className={styles.productItem}>
                        <span className={styles.prodName}>{prod.name}</span>
                        <div className={styles.dots}></div>
                        <span className={styles.prodPrice}>{prod.price}</span>
                      </div>
                    ))}
                  </div>

                  <Link href={`/product/${look.id}`} className={styles.shopBtn}>
                    COMPRAR O LOOK ➜
                  </Link>
                </motion.div>
              </div>

            </section>
          ))
        )}
      </div>

      {/* FINAL CTA */}
      <div className={styles.finalCta}>
        <h2>QUER VER MAIS?</h2>
        <Link href="/shop" className={styles.btnOutline}>IR PARA A LOJA</Link>
      </div>

      {/* COMING SOON SECTION */}
      <section className={styles.comingSoon} style={{ marginTop: '80px', textAlign: 'center', opacity: 0.7 }}>
        <div style={{ border: '2px dashed #000', padding: '40px', display: 'inline-block' }}>
          <h3 style={{ fontFamily: 'Oswald', fontSize: '2rem' }}>PRÓXIMO DROP EM BREVE</h3>
          <p>Estamos fotografando o novo editorial. Aguarde.</p>
        </div>
      </section>

    </main>
  );
}