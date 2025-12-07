'use client';

import { useState, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from './page.module.css';
import api from '@/services/api';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import CartConfirmationModal from '@/components/CartConfirmationModal/CartConfirmationModal';

export default function ProductPage({ params }) {
  // Desembrulha a promise params
  const { slug } = use(params);

  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [relatedItems, setRelatedItems] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  // Fetch Product Data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${slug}`);
        setProduct(response.data);

        // Carregar reviews
        const reviewsRes = await api.get(`/products/${slug}/reviews`);
        setReviews(reviewsRes.data);

        // Carregar relacionados (mock ou endpoint real)
        const relatedRes = await api.get('/products', { params: { limit: 4 } });
        setRelatedItems(relatedRes.data.data.filter(p => p.id !== response.data.id));

      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  // Derived State for Variations
  const availableColors = product?.variations
    ? [...new Set(product.variations.map(v => v.attributes.Color))].filter(Boolean)
    : [];

  const availableSizes = product?.variations
    ? [...new Set(product.variations.map(v => v.attributes.Size))].filter(Boolean)
    : [];

  // Helper to get Hex for a color name
  const getColorHex = (colorName) => {
    // Try to find in product attributes definition
    if (!product?.attributes) return colorName;
    const colorAttr = product.attributes.find(a => a.name === 'Color' || a.name === 'Cor');
    if (!colorAttr || !colorAttr.options) return colorName;

    // Options can be strings or objects
    const option = colorAttr.options.find(o => (typeof o === 'string' ? o === colorName : o.name === colorName));
    if (typeof option === 'object' && option.hex) return option.hex;
    return colorName; // Fallback
  };

  // Set defaults
  useEffect(() => {
    if (product && !selectedColor && availableColors.length > 0) {
      setSelectedColor(availableColors[0]);
    }
  }, [product, availableColors]);

  const handleAddToCart = async () => {
    if (product.is_variable) {
      if (!selectedColor || !selectedSize) {
        setFeedback('Selecione cor e tamanho!');
        return;
      }

      const variation = product.variations.find(v =>
        v.attributes.Color === selectedColor &&
        v.attributes.Size === selectedSize
      );

      if (!variation) {
        setFeedback('Combinação indisponível.');
        return;
      }

      if (variation.stock <= 0) {
        setFeedback('Ops! Sem estoque.');
        return;
      }

      await addToCart(product, 1, variation, false); // false = don't open sidebar
    } else {
      if (product.stock <= 0) {
        setFeedback('Ops! Sem estoque.');
        return;
      }
      await addToCart(product, 1, null, false); // false = don't open sidebar
    }
    setShowConfirm(true);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setFeedback('Faça login para avaliar!');
      return;
    }

    const formData = new FormData(e.target);
    const comment = formData.get('comment');
    const name = formData.get('name'); // Opcional se usar user.name

    try {
      await api.post('/reviews', {
        productId: product.id,
        rating,
        comment,
        title: "Avaliação do Cliente"
      });

      // Refresh reviews
      const reviewsRes = await api.get(`/products/${slug}/reviews`);
      setReviews(reviewsRes.data);
      setReviewFormOpen(false);
      setFeedback('Obrigado pelo review! 🖤');
    } catch (error) {
      console.error("Review error", error);
      setFeedback('Erro ao enviar review.');
    }
  };

  if (loading) return <div className={styles.loading}>CARREGANDO O HYPE...</div>;
  if (!product) return <div className={styles.loading}>PRODUTO NÃO ENCONTRADO :(</div>;

  const displayPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price);
  const images = (product.images || []).map(img =>
    typeof img === 'string' ? img : (img?.src || 'https://via.placeholder.com/800x800?text=NO+IMAGE')
  );

  return (
    <main className={styles.main}>

      {/* Fundo Quadriculado */}
      <div className={styles.bgGrid}></div>

      {feedback && (
        <motion.div
          className={styles.toast}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 20, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
        >
          {feedback}
        </motion.div>
      )}

      <div className={styles.container}>

        {/* --- COLUNA ESQUERDA (GALERIA SCRAPBOOK) --- */}
        <div className={styles.gallery}>
          <div className={styles.mainImageWrapper}>
            <div className={styles.tapeTop}></div>
            <motion.img
              key={activeImg}
              src={images[activeImg] || 'https://via.placeholder.com/800?text=NO+IMAGE'}
              className={styles.mainImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            {/* Sticker decorativo na foto */}
            <div className={styles.stickerPhoto}>LOOKINHO</div>
          </div>

          <div className={styles.thumbGrid}>
            {images.map((img, idx) => (
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
                {product.is_new && <span className={styles.tagNew}>NEW DROP</span>}
                {product.is_hot && <span className={styles.tagSeason}>HOT</span>}
              </div>

              <h1 className={styles.title}>{product.name}</h1>

              <div className={styles.priceRow}>
                <span className={styles.priceTag}>{displayPrice}</span>
                <div className={styles.ratingSummary}>
                  <span className={styles.stars}>★★★★★</span>
                  <span className={styles.reviewCount}>({reviews.length} reviews)</span>
                </div>
              </div>
            </div>

            <p className={styles.description}>
              <span className={styles.doodleArrow}>➔</span>
              {product.description}
            </p>

            <div className={styles.productDetails}>
              {product.brand && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>MARCA:</span>
                  <span className={styles.detailValue}>{product.brand}</span>
                </div>
              )}
              {product.category && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>CATEGORIA:</span>
                  <span className={styles.detailValue}>{product.category}</span>
                </div>
              )}
              {product.dimensions && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>DIMENSÕES:</span>
                  <span className={styles.detailValue}>
                    {product.dimensions.height}x{product.dimensions.width}x{product.dimensions.length}cm
                  </span>
                </div>
              )}
            </div>

            <div className={styles.selectors}>
              {/* COR */}
              {availableColors.length > 0 && (
                <div className={styles.selectorGroup}>
                  <label>COR: <span className={styles.scriptLabel}>{selectedColor}</span></label>
                  <div className={styles.colorOptions}>
                    {availableColors.map(c => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`${styles.colorBtn} ${selectedColor === c ? styles.activeColorBtn : ''}`}
                        style={{ backgroundColor: getColorHex(c) }}
                        title={c}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* TAMANHO */}
              {availableSizes.length > 0 && (
                <div className={styles.selectorGroup}>
                  <label>TAMANHO: <span className={styles.scriptLabel}>{selectedSize}</span></label>
                  <div className={styles.sizeOptions}>
                    {availableSizes.map(s => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`${styles.sizeBtn} ${selectedSize === s ? styles.activeSize : ''}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button className={styles.addToCartBtn} onClick={handleAddToCart}>
              BOTA NA SACOLA! 🛍️
            </button>

            <CartConfirmationModal
              isOpen={showConfirm}
              onClose={() => setShowConfirm(false)}
              product={product}
            />

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
              onSubmit={submitReview}
            >
              <h3>AVALIE ESSE LOOK</h3>
              <div className={styles.starInput}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} onClick={() => setRating(star)} className={star <= rating ? styles.starFilled : styles.starEmpty}>★</span>
                ))}
              </div>
              <input name="name" type="text" placeholder="SEU NOME" className={styles.input} defaultValue={user?.name} />
              <textarea name="comment" placeholder="CONTA PRA GENTE O QUE ACHOU..." className={styles.textarea} rows={3}></textarea>
              <button className={styles.submitBtn}>ENVIAR</button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* CARDS DE REVIEW */}
        <div className={styles.reviewsGrid}>
          {reviews.length === 0 ? <p>Seja o primeiro a avaliar!</p> : reviews.map((review) => (
            <div key={review.id} className={styles.reviewCard}>
              <div className={styles.pin}></div>
              <div className={styles.reviewTop}>
                <div className={styles.userInfo}>
                  <img src={review.user?.avatar || "https://i.pravatar.cc/150"} alt={review.user?.name} className={styles.userAvatar} />
                  <div>
                    <span className={styles.userName}>{review.user?.name || "Anônimo"}</span>
                    {/* {review.verified && <span className={styles.verified}>COMPRA VERIFICADA</span>} */}
                  </div>
                </div>
                <div className={styles.stars}>{"★".repeat(review.rating)}</div>
              </div>
              <p className={styles.reviewText}>"{review.comment}"</p>
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
            <ProductCard key={item.id} product={{
              ...item,
              price: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price),
              imgFront: item.images?.[0],
              imgBack: item.images?.[1] || item.images?.[0]
            }} />
          ))}
        </div>
      </section>

    </main>
  );
}