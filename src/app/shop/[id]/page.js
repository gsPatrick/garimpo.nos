'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { notFound } from 'next/navigation'; // Para redirecionar se ID não existir
import { PRODUCTS_DB } from '@/data/products'; // Importa nosso banco de dados
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from './page.module.css';

// Reviews Fakes (Padrão para todos por enquanto)
const MOCK_REVIEWS = [
  { id: 1, user: "Ana K.", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d", rating: 5, date: "Há 2 dias", text: "Gente, sério! O tecido é perfeito, não fica transparente. Amei demais!", verified: true },
  { id: 2, user: "Bia J.", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d", rating: 5, date: "Semana passada", text: "Chegou super rápido e o cheirinho da caixa? Tudo pra mim.", verified: true },
];

export default function ProductPage({ params }) {
  // 1. Encontra o produto baseado no ID da URL
  const product = PRODUCTS_DB.find(p => p.id === params.id);

  // Se não achar o produto, joga para 404 (opcional)
  if (!product) {
    // Retorno simples de erro ou use notFound() do next
    return <div style={{padding: 100, textAlign: 'center'}}>PRODUTO NÃO ENCONTRADO :(</div>;
  }

  // Estados locais
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0].name);
  const [activeImg, setActiveImg] = useState(0);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [rating, setRating] = useState(0);

  // Produtos relacionados (Exclui o atual)
  const relatedItems = PRODUCTS_DB.filter(p => p.id !== product.id).slice(0, 4);

  return (
    <main className={styles.main}>
      
      {/* Fundo Quadriculado */}
      <div className={styles.bgGrid}></div>

      <div className={styles.container}>
        
        {/* --- COLUNA ESQUERDA (GALERIA SCRAPBOOK) --- */}
        <div className={styles.gallery}>
          <div className={styles.mainImageWrapper}>
            <div className={styles.tapeTop}></div>
            
            <AnimatePresence mode='wait'>
              <motion.img 
                key={activeImg} 
                src={product.images[activeImg] || product.imgFront} 
                className={styles.mainImage} 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>

            {/* Sticker decorativo na foto */}
            <div className={styles.stickerPhoto}>LOOKINHO</div>
          </div>
          
          <div className={styles.thumbGrid}>
            {product.images.map((img, idx) => (
              <div 
                key={idx} 
                className={`${styles.thumb} ${activeImg === idx ? styles.activeThumb : ''}`} 
                onClick={() => setActiveImg(idx)}
              >
                <img src={img} alt="thumbnail" />
              </div>
            ))}
          </div>
        </div>

        {/* --- COLUNA DIREITA (INFO CADERNO) --- */}
        <div className={styles.infoPanel}>
          <div className={styles.stickyWrapper}>
            
            <div className={styles.header}>
              <div className={styles.tagWrapper}>
                <span className={styles.tagNew}>NEW DROP</span>
                <span className={styles.tagSeason}>{product.category}</span>
              </div>
              
              <h1 className={styles.title}>{product.name}</h1>
              
              <div className={styles.priceRow}>
                <span className={styles.priceTag}>{product.price}</span>
                <div className={styles.ratingSummary}>
                  <span className={styles.stars}>★★★★★</span>
                  <span className={styles.reviewCount}>(Mock reviews)</span>
                </div>
              </div>
            </div>

            <p className={styles.description}>
              <span className={styles.doodleArrow}>➔</span>
              {product.description}
            </p>
            
            <div className={styles.selectors}>
               {/* COR */}
               <div className={styles.selectorGroup}>
                  <label>COR: <span className={styles.scriptLabel}>{selectedColor}</span></label>
                  <div className={styles.colorOptions}>
                    {product.colors.map(c => (
                      <button 
                        key={c.name} 
                        onClick={()=>setSelectedColor(c.name)} 
                        className={`${styles.colorBtn} ${selectedColor === c.name ? styles.activeColorBtn : ''}`}
                        style={{backgroundColor: c.hex}} 
                        title={c.name}
                      />
                    ))}
                  </div>
               </div>

               {/* TAMANHO */}
               <div className={styles.selectorGroup}>
                  <label>TAMANHO: <span className={styles.scriptLabel}>{selectedSize}</span></label>
                  <div className={styles.sizeOptions}>
                    {product.sizes.map(s => (
                      <button 
                        key={s} 
                        onClick={()=>setSelectedSize(s)} 
                        className={`${styles.sizeBtn} ${selectedSize === s ? styles.activeSize : ''}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
               </div>
            </div>

            <button className={styles.addToCartBtn}>
              BOTA NA SACOLA! 🛍️
            </button>

            <div className={styles.shippingNote}>
              <span className={styles.truckIcon}>🚚</span> FRETE GRÁTIS acima de R$ 500
            </div>
          </div>
        </div>
      </div>

      {/* --- AVALIAÇÕES (MURAL DE RECADOS) --- */}
      <section className={styles.reviewsSection}>
        <div className={styles.reviewsHeader}>
          <h2>
            QUEM JÁ COMPROU & <span className={styles.scriptHighlight}>Amou!</span>
          </h2>
          <button 
            className={styles.writeReviewBtn} 
            onClick={() => setReviewFormOpen(!reviewFormOpen)}
          >
            {reviewFormOpen ? 'FECHAR X' : 'DEIXAR MEU RECADO ✎'}
          </button>
        </div>

        {/* FORM */}
        <AnimatePresence>
          {reviewFormOpen && (
            <motion.form 
              className={styles.reviewForm}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={(e) => e.preventDefault()}
            >
              <h3>AVALIE ESSE LOOK</h3>
              <div className={styles.starInput}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} onClick={() => setRating(star)} className={star <= rating ? styles.starFilled : styles.starEmpty}>★</span>
                ))}
              </div>
              <input type="text" placeholder="SEU NOME" className={styles.input} />
              <textarea placeholder="CONTA PRA GENTE O QUE ACHOU..." className={styles.textarea} rows={3}></textarea>
              <button className={styles.submitBtn}>ENVIAR</button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* CARDS DE REVIEW */}
        <div className={styles.reviewsGrid}>
          {MOCK_REVIEWS.map((review) => (
            <div key={review.id} className={styles.reviewCard}>
              <div className={styles.pin}></div>
              <div className={styles.reviewTop}>
                <div className={styles.userInfo}>
                  <img src={review.avatar} alt={review.user} className={styles.userAvatar} />
                  <div>
                    <span className={styles.userName}>{review.user}</span>
                    {review.verified && <span className={styles.verified}>COMPRA VERIFICADA</span>}
                  </div>
                </div>
                <div className={styles.stars}>{"★".repeat(review.rating)}</div>
              </div>
              <p className={styles.reviewText}>"{review.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- ITENS RELACIONADOS --- */}
      <section className={styles.relatedSection}>
        <h2 className={styles.relatedTitle}>
          COMPLETE O <span className={styles.scriptPink}>Look</span>
        </h2>
        
        <div className={styles.relatedGrid}>
          {relatedItems.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>

    </main>
  );
}   