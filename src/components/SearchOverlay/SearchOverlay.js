'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import styles from './SearchOverlay.module.css';
import api from '@/services/api';

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const debounceTimeout = useRef(null);

  // Foca no input sempre que abre
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Limpa a busca ao fechar
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Busca Debounced
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    setLoading(true);
    debounceTimeout.current = setTimeout(async () => {
      try {
        const response = await api.get('/products', {
          params: { search: query, limit: 5 }
        });

        const mappedResults = response.data.data.map(p => ({
          id: p.id,
          name: p.name,
          price: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.price),
          category: p.category?.name || 'Streetwear',
          imgFront: p.images?.[0] || 'https://via.placeholder.com/800x800?text=No+Image'
        }));

        setResults(mappedResults);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(debounceTimeout.current);
  }, [query]);

  const [categories, setCategories] = useState([]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        if (response.data && Array.isArray(response.data)) {
          setCategories(response.data.slice(0, 5));
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

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

              {/* CASO: CARREGANDO */}
              {loading && <p className={styles.loadingText}>BUSCANDO...</p>}

              {/* CASO: SEM RESULTADOS */}
              {!loading && query && results.length === 0 && (
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
              {!loading && query && results.length > 0 && (
                <div className={styles.resultsList}>
                  {results.map((item, index) => (
                    <Link href={`/product/${item.id}`} key={item.id} onClick={onClose} className={styles.linkWrapper}>
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
                    {categories.map(cat => (
                      <button key={cat.id} onClick={() => setQuery(cat.name)} className={styles.tagBtn}>
                        #{cat.name.toUpperCase()}
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