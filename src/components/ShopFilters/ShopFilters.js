'use client';

import { useState, useEffect } from 'react';
import styles from './ShopFilters.module.css';
import api from '@/services/api';

export default function ShopFilters({ mobileOpen, closeMobile, onFilterChange }) {
  const [categories, setCategories] = useState(["Tudo"]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]); // Array of { name, hex }

  const [selectedCat, setSelectedCat] = useState("Tudo");
  const [selectedSize, setSelectedSize] = useState(null);
  const [priceRange, setPriceRange] = useState(500);
  const [selectedColor, setSelectedColor] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Categories
        const catResponse = await api.get('/categories');
        const catData = Array.isArray(catResponse.data) ? catResponse.data : (catResponse.data.data || []);
        setCategories(["Tudo", ...catData.map(c => c.name)]);

        // Fetch Filters (Sizes, Colors)
        const filterResponse = await api.get('/products/filters');
        if (filterResponse.data) {
          setSizes(filterResponse.data.sizes || []);
          setColors(filterResponse.data.colors || []);
        }
      } catch (error) {
        console.error("Failed to fetch filters", error);
      }
    };
    fetchData();
  }, []);

  const handleCategoryClick = (cat) => {
    setSelectedCat(cat);
    onFilterChange({ category: cat === "Tudo" ? "" : cat });
  };

  const handlePriceChange = (e) => {
    const val = e.target.value;
    setPriceRange(val);
    // Debounce could be added here, but for now passing directly
    onFilterChange({ maxPrice: val });
  };

  const handleSizeClick = (size) => {
    const newSize = size === selectedSize ? null : size;
    setSelectedSize(newSize);
    onFilterChange({ size: newSize });
  };

  const handleColorClick = (colorName) => {
    const newColor = colorName === selectedColor ? null : colorName;
    setSelectedColor(newColor);
    onFilterChange({ color: newColor });
  };

  return (
    <aside className={`${styles.sidebar} ${mobileOpen ? styles.open : ''}`}>

      {/* Header Mobile */}
      <div className={styles.mobileHeader}>
        <h3 className={styles.stickerTitle}>FILTROS</h3>
        <button onClick={closeMobile} className={styles.closeBtn}>✕</button>
      </div>

      {/* Decoração de Fita */}
      <div className={styles.tapeTop}></div>

      {/* SEÇÃO 1: CATEGORIAS */}
      <div className={styles.filterGroup}>
        <h3 className={styles.groupTitle}>CATEGORIAS</h3>
        <ul className={styles.catList}>
          {categories.map((cat) => (
            <li key={cat}>
              <button
                className={`${styles.catBtn} ${selectedCat === cat ? styles.activeCat : ''}`}
                onClick={() => handleCategoryClick(cat)}
              >
                {/* Seta desenhada no ativo */}
                {selectedCat === cat && <span className={styles.doodleArrow}>➔</span>}
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* SEÇÃO 2: TAMANHOS */}
      <div className={styles.filterGroup}>
        <h3 className={styles.groupTitle}>TAMANHO</h3>
        <div className={styles.sizeGrid}>
          {sizes.length > 0 ? sizes.map((size) => (
            <button
              key={size}
              className={`${styles.sizeBtn} ${selectedSize === size ? styles.activeSize : ''}`}
              onClick={() => handleSizeClick(size)}
            >
              {size}
            </button>
          )) : <p style={{ fontSize: '0.8rem', color: '#888' }}>Nenhum tamanho disponível</p>}
        </div>
      </div>

      {/* SEÇÃO 3: FAIXA DE PREÇO */}
      <div className={styles.filterGroup}>
        <h3 className={styles.groupTitle}>PREÇO</h3>
        <div className={styles.priceControl}>
          <input
            type="range"
            min="0"
            max="1000"
            value={priceRange}
            onChange={handlePriceChange}
            className={styles.slider}
          />
          <div className={styles.priceLabels}>
            <span>R$ 0</span>
            <span className={styles.currentPrice}>R$ {priceRange}</span>
          </div>
        </div>
      </div>

      {/* SEÇÃO 4: CORES */}
      <div className={styles.filterGroup}>
        <h3 className={styles.groupTitle}>COR</h3>
        <div className={styles.colorGrid}>
          {colors.length > 0 ? colors.map((col) => (
            <button
              key={col.name}
              className={`${styles.colorBtn} ${selectedColor === col.name ? styles.activeColor : ''}`}
              style={{
                backgroundColor: col.hex, // Use hex from API object
                border: selectedColor === col.name ? '2px solid #000' : '1px solid #ddd',
                transform: selectedColor === col.name ? 'scale(1.1)' : 'scale(1)'
              }}
              title={col.name}
              onClick={() => handleColorClick(col.name)}
            />
          )) : <p style={{ fontSize: '0.8rem', color: '#888' }}>Nenhuma cor disponível</p>}
        </div>
      </div>

      {/* Doodle no final */}

    </aside>
  );
}