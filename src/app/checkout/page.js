'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import AuthModal from '@/components/AuthModal/AuthModal';
import styles from './page.module.css';
import api from '@/services/api';
import { initMercadoPago, createCardToken } from '@mercadopago/sdk-react';

// INICIALIZA O MERCADO PAGO (Substitua pela sua PUBLIC KEY)
initMercadoPago('TEST-ce537820-227e-4f05-9a8c-762222333333');

export default function CheckoutPage() {
  const { cartItems, subtotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(!isAuthenticated);
  const [pixData, setPixData] = useState(null); // Estado para dados do Pix

  // Dados do Formulário
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    zip: '',
    city: '',
    state: '',
    cardNumber: '',
    cardExpiration: '',
    cardCvv: '',
    cardHolder: ''
  });

  // Lógica de Cupom
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [feedback, setFeedback] = useState('');

  // Preencher dados do usuário
  useEffect(() => {
    if (user) {
      const [first, ...rest] = (user.name || '').split(' ');
      setFormData(prev => ({
        ...prev,
        firstName: first || '',
        lastName: rest.join(' ') || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  // Efeito para garantir que o modal abra/feche baseado no estado de autenticação
  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      setShowAuthModal(false);
    }
  }, [isAuthenticated]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setFeedback('');
    try {
      const response = await api.post('/coupons/validate', { code: couponCode, subtotal });
      if (response.data.valid) {
        setDiscount(response.data.discountAmount);
        setCouponApplied(true);
        setFeedback('CUPOM APLICADO! ★');
      } else {
        setFeedback('Cupom inválido :(');
      }
    } catch (error) {
      // Fallback local para teste
      if (couponCode.toUpperCase() === 'GARIMPO10') {
        setDiscount(subtotal * 0.1);
        setCouponApplied(true);
        setFeedback('CUPOM APLICADO! ★');
      } else {
        setFeedback('Erro ao validar cupom.');
      }
    }
  };

  const total = subtotal - discount;

  const handleCheckout = async (e) => {
    e.preventDefault();
    setFeedback('');

    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Criar Pedido
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          variationId: item.variation?.id,
          price: item.price
        })),
        shippingAddress: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip
        },
        subtotal,
        discount,
        total,
        paymentMethod
      };

      const orderRes = await api.post('/orders', orderData);
      const orderId = orderRes.data.id;

      // 2. Processar Pagamento
      let paymentData = {
        orderId,
        provider: 'mercadopago',
        email: user?.email || 'test@test.com'
      };

      if (paymentMethod === 'credit') {
        const token = await createCardToken({
          cardNumber: formData.cardNumber.replace(/\s/g, ''),
          cardholderName: formData.cardHolder,
          cardExpirationMonth: formData.cardExpiration.split('/')[0],
          cardExpirationYear: '20' + formData.cardExpiration.split('/')[1],
          securityCode: formData.cardCvv,
          identificationType: 'CPF',
          identificationNumber: '12345678909'
        });

        // Simple BIN detection for Payment Method ID
        const bin = formData.cardNumber.replace(/\s/g, '').substring(0, 6);
        let paymentMethodId = 'master'; // Default fallback
        if (bin.startsWith('4')) paymentMethodId = 'visa';
        else if (bin.startsWith('5')) paymentMethodId = 'master';
        else if (bin.startsWith('34') || bin.startsWith('37')) paymentMethodId = 'amex';
        else if (bin.startsWith('6')) paymentMethodId = 'elo';
        else if (bin.startsWith('30') || bin.startsWith('36') || bin.startsWith('38')) paymentMethodId = 'diners';

        paymentData = {
          ...paymentData,
          method: paymentMethodId,
          payment_method_id: paymentMethodId, // Redundant but requested
          cardToken: token.id,
          installments: 1
        };
      } else {
        // PIX
        paymentData = {
          ...paymentData,
          method: 'pix',
          payment_method_id: 'pix',
          installments: 1
        };
      }

      const paymentRes = await api.post('/payments/process', paymentData);

      // Se for Pix, captura os dados
      if (paymentMethod === 'pix' && paymentRes.data) {
        const resultData = paymentRes.data.result || paymentRes.data;
        setPixData({
          qrCode: resultData.qr_code,
          qrCodeBase64: resultData.qr_code_base64
        });
      }

      // Sucesso
      setIsSuccess(true);
      clearCart();

    } catch (error) {
      console.error("Checkout failed", error);
      setFeedback('Erro no pagamento. Verifique os dados.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0 && !isSuccess) {
    return (
      <div className={styles.emptyPage}>
        <div className={styles.sadSticker}>:(</div>
        <h1>SUA SACOLA ESTÁ VAZIA</h1>
        <Link href="/shop" className={styles.backBtn}>VOLTAR PARA O GARIMPO</Link>
      </div>
    );
  }

  return (
    <main className={styles.main}>

      <div className={styles.bgTexture}></div>

      <AnimatePresence>
        {showAuthModal && (
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => {
              if (isAuthenticated) setShowAuthModal(false);
            }}
          />
        )}
      </AnimatePresence>

      <div className={styles.container}>

        {/* ESQUERDA: FORMULÁRIOS */}
        <div className={styles.formColumn}>

          <h1 className={styles.pageTitle}>
            <span className={styles.wordSolid}>FINALIZAR</span>
            <span className={styles.wordScript}>Pedido</span>
          </h1>

          {/* ÁREA DE CUPOM */}
          <div className={styles.couponSection}>
            <div className={styles.couponTicket}>
              <div className={styles.cutLine}></div>
              <div className={styles.couponContent}>
                <label className={styles.couponLabel}>
                  TEM UM <span className={styles.scriptPink}>Cupom?</span>
                </label>
                <div className={styles.couponInputWrapper}>
                  <input
                    type="text"
                    placeholder="INSIRA SEU CÓDIGO"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={couponApplied}
                  />
                  <button onClick={handleApplyCoupon} disabled={couponApplied}>
                    {couponApplied ? 'APLICADO! ★' : 'USAR'}
                  </button>
                </div>
                {feedback && <p className={styles.successMsg} style={{ color: feedback.includes('Erro') || feedback.includes('inválido') ? 'red' : 'inherit' }}>{feedback}</p>}
              </div>
              <span className={styles.scissorIcon}>✂</span>
            </div>
          </div>

          <form id="checkout-form" onSubmit={handleCheckout}>

            {/* 1. DADOS */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.stepNum}>01</span>
                <h2>SEUS DADOS</h2>
              </div>

              {isAuthenticated && (
                <div className={styles.loggedInBadge}>
                  LOGADO COMO: <strong>{user?.name}</strong> ({user?.email})
                </div>
              )}

              <div className={styles.inputGroup}>
                <input
                  type="email"
                  placeholder="E-MAIL"
                  className={styles.input}
                  defaultValue={user?.email || ''}
                  required
                  readOnly={isAuthenticated}
                />
                <input
                  name="phone"
                  type="text"
                  placeholder="WHATSAPP / TELEFONE"
                  className={styles.input}
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </section>

            {/* 2. ENTREGA */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.stepNum}>02</span>
                <h2>ENTREGA</h2>
              </div>
              <div className={styles.grid2}>
                <input
                  name="firstName"
                  type="text"
                  placeholder="NOME"
                  className={styles.input}
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
                <input
                  name="lastName"
                  type="text"
                  placeholder="SOBRENOME"
                  className={styles.input}
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <input
                name="address"
                type="text"
                placeholder="ENDEREÇO"
                className={styles.input}
                value={formData.address}
                onChange={handleInputChange}
                required
              />
              <div className={styles.grid3}>
                <input
                  name="zip"
                  type="text"
                  placeholder="CEP"
                  className={styles.input}
                  value={formData.zip}
                  onChange={handleInputChange}
                  required
                />
                <input
                  name="city"
                  type="text"
                  placeholder="CIDADE"
                  className={styles.input}
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
                <input
                  name="state"
                  type="text"
                  placeholder="UF"
                  className={styles.input}
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </section>

            {/* 3. PAGAMENTO */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.stepNum}>03</span>
                <h2>PAGAMENTO</h2>
              </div>
              <div className={styles.paymentGrid}>
                <button type="button" className={`${styles.payOption} ${paymentMethod === 'credit' ? styles.activePay : ''}`} onClick={() => setPaymentMethod('credit')}>
                  <span className={styles.payIcon}>💳</span> CARTÃO
                </button>
                <button type="button" className={`${styles.payOption} ${paymentMethod === 'pix' ? styles.activePay : ''}`} onClick={() => setPaymentMethod('pix')}>
                  <span className={styles.payIcon}>💠</span> PIX
                </button>
              </div>

              {paymentMethod === 'credit' && (
                <motion.div className={styles.cardForm} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  <input
                    name="cardNumber"
                    type="text"
                    placeholder="NÚMERO DO CARTÃO"
                    className={styles.input}
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                  />
                  <div className={styles.grid2}>
                    <input
                      name="cardExpiration"
                      type="text"
                      placeholder="VALIDADE (MM/AA)"
                      className={styles.input}
                      value={formData.cardExpiration}
                      onChange={handleInputChange}
                    />
                    <input
                      name="cardCvv"
                      type="text"
                      placeholder="CVV"
                      className={styles.input}
                      value={formData.cardCvv}
                      onChange={handleInputChange}
                    />
                  </div>
                  <input
                    name="cardHolder"
                    type="text"
                    placeholder="NOME NO CARTÃO"
                    className={styles.input}
                    value={formData.cardHolder}
                    onChange={handleInputChange}
                  />
                </motion.div>
              )}
              {paymentMethod === 'pix' && (
                <motion.div className={styles.pixBox} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p>O QR Code será gerado na próxima tela com desconto de 5%!</p>
                </motion.div>
              )}
            </section>
          </form>
        </div>

        {/* DIREITA: RESUMO */}
        <div className={styles.summaryColumn}>
          <div className={styles.summaryCard}>
            <div className={styles.tapeTop}></div>

            <h2 className={styles.summaryTitle}>SEU PEDIDO</h2>

            <div className={styles.itemsList}>
              {cartItems.map((item) => (
                <div key={item.id} className={styles.itemRow}>
                  <div className={styles.imgWrapper}>
                    <img src={item.image || 'https://via.placeholder.com/100?text=No+Image'} alt={item.name} />
                    <span className={styles.qtyBadge}>{item.quantity}</span>
                  </div>
                  <div className={styles.itemInfo}>
                    <h4>{item.name}</h4>
                    <p>{item.color} / {item.size}</p>
                  </div>
                  <span className={styles.itemPrice}>R$ {item.price}</span>
                </div>
              ))}
            </div>

            <div className={styles.divider}></div>

            <div className={styles.totals}>
              <div className={styles.totalRow}>
                <span>SUBTOTAL</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>

              {couponApplied && (
                <div className={`${styles.totalRow} ${styles.discountRow}`}>
                  <span>CUPOM</span>
                  <span>- R$ {discount.toFixed(2)}</span>
                </div>
              )}

              <div className={styles.totalRow}>
                <span>FRETE</span>
                <span className={styles.free}>GRÁTIS</span>
              </div>

              <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                <span>TOTAL</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
            </div>

            <button type="submit" form="checkout-form" className={styles.payBtn} disabled={isProcessing}>
              {isProcessing ? 'PROCESSANDO...' : 'CONFIRMAR COMPRA ➜'}
            </button>

            <p className={styles.secureText}>🔒 AMBIENTE SEGURO</p>
          </div>
        </div>
      </div>

      {/* MODAL DE SUCESSO */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div className={styles.successOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div className={styles.successModal} initial={{ scale: 0.8, rotate: -5 }} animate={{ scale: 1, rotate: 0 }}>
              <div className={styles.checkIcon}>★</div>
              <h1>PEDIDO CONFIRMADO!</h1>
              <p>Bem-vinda ao clube. Seu garimpo já é seu.</p>

              {paymentMethod === 'pix' && pixData ? (
                <div className={styles.pixContainer} style={{ margin: '20px 0', textAlign: 'center' }}>
                  <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>ESCANEIE O QR CODE:</p>
                  <div style={{ padding: '10px', background: 'white', border: '2px solid black', display: 'inline-block', boxShadow: '4px 4px 0px #000' }}>
                    <img
                      src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                      alt="QR Code Pix"
                      style={{ width: '200px', height: '200px' }}
                    />
                  </div>
                  <div style={{ marginTop: '15px' }}>
                    <p style={{ fontSize: '0.8rem', marginBottom: '5px' }}>Ou copie o código:</p>
                    <textarea
                      readOnly
                      value={pixData.qrCode}
                      style={{ width: '100%', fontSize: '0.7rem', padding: '5px', border: '1px solid #000' }}
                    />
                  </div>
                </div>
              ) : (
                <div className={styles.orderId}>PEDIDO #CONFIRMADO</div>
              )}

              <Link href="/account/orders" className={styles.homeLink}>VER MEUS PEDIDOS</Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}