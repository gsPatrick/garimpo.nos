'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { PRODUCTS_DB } from '@/data/products'; // Consumindo o Mock Real
import styles from './SearchOverlay.module.css';

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  // Foca no input sempre que abre
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Limpa a busca ao fechar
  useEffect(() => {
    if (!isOpen) setQuery('');
  }, [isOpen]);

  // Filtro no Mock DB
  const filteredItems = PRODUCTS_DB.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase()) || 
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Fundo com ruído/grid */}
          <div className={styles.bgTexture}></div>

          <div className={styles.container}>
            
            {/* Botão Fechar (Estilo Sticker) */}
            <button onClick={onClose} className={styles.closeBtn}>
              FECHAR ✕
            </button>

            {/* Cabeçalho da Busca */}
            <div className={styles.searchHeader}>
              <span className={styles.searchLabel}>O QUE VOCÊ PROCURA?</span>
              <div className={styles.inputWrapper}>
                <input 
                  ref={inputRef}
                  type="text" 
                  placeholder="DIGITE AQUI..." 
                  className={styles.input}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <motion.div 
                  className={styles.underline} 
                  layoutId="underline"
                />
              </div>
            </div>

            {/* Área de Resultados */}
            <div className={styles.resultsArea}>
              
              {/* CASO: SEM RESULTADOS */}
              {query && filteredItems.length === 0 && (
                <motion.div 
                  className={styles.emptyState}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className={styles.sadFace}>:(</div>
                  <p>OPS! NÃO ENCONTRAMOS NADINHA COM "{query}"</p>
                  <span>Tente buscar por "Cropped", "Tee" ou "Neon"</span>
                </motion.div>
              )}

              {/* CASO: LISTA DE RESULTADOS */}
              {query && filteredItems.length > 0 && (
                <div className={styles.resultsList}>
                  {filteredItems.map((item, index) => (
                    <Link href={`/shop/${item.id}`} key={item.id} onClick={onClose} className={styles.linkWrapper}>
                      <motion.div 
                        className={styles.resultItem}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ x: 10, backgroundColor: 'var(--bg-hover)' }}
                      >
                        <div className={styles.thumbWrapper}>
                          <img src={item.imgFront} alt={item.name} />
                        </div>
                        
                        <div className={styles.itemInfo}>
                          <span className={styles.catTag}>{item.category}</span>
                          <h3 className={styles.itemName}>{item.name}</h3>
                          <span className={styles.itemPrice}>{item.price}</span>
                        </div>

                        <div className={styles.arrowAction}>➔</div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              )}

              {/* CASO: BUSCA VAZIA (SUGESTÕES) */}
              {!query && (
                <div className={styles.suggestions}>
                  <p className={styles.suggestionsTitle}>VIBES DO MOMENTO:</p>
                  <div className={styles.tagsCloud}>
                    {['CROPPED', 'OVERSIZED', 'CARGO', 'NEON', 'ACESSÓRIOS'].map(tag => (
                      <button key={tag} onClick={() => setQuery(tag)} className={styles.tagBtn}>
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}