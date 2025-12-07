'use client';

import { useState, useEffect } from 'react';
import styles from './orders.module.css';
import api from '@/services/api';
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPix, setSelectedPix] = useState(null); // Para o modal do Pix

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders/my-orders');
        // Mapeia os dados do backend para o formato do componente
        const mappedOrders = response.data.map(order => {
          // Encontra o último pagamento (caso haja múltiplas tentativas)
          const latestPayment = order.Payments && order.Payments.length > 0
            ? order.Payments[order.Payments.length - 1]
            : null;

          return {
            id: `#${order.id}`,
            date: new Date(order.createdAt).toLocaleDateString('pt-BR'),
            status: order.status, // pending, paid, shipped, delivered, cancelled
            paymentMethod: order.payment_method,
            paymentStatus: order.payment_status,
            total: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total),
            items: order.items.map(item => item.product?.images?.[0] || 'https://via.placeholder.com/200'),
            pixData: (order.payment_method === 'pix' && latestPayment?.metadata)
              ? {
                qrCode: latestPayment.metadata.qr_code,
                qrCodeBase64: latestPayment.metadata.qr_code_base64
              }
              : null
          };
        });
        setOrders(mappedOrders);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p>Carregando pedidos...</p>;

  if (orders.length === 0) {
    return (
      <div>
        <h1 className={styles.title}>MEUS <span className={styles.highlight}>PEDIDOS</span></h1>
        <p>Você ainda não fez nenhum pedido :(</p>
        <Link href="/shop" style={{ textDecoration: 'underline', marginTop: '1rem', display: 'block' }}>
          IR PARA A LOJA
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className={styles.title}>HISTÓRICO DE <span className={styles.highlight}>PEDIDOS</span></h1>

      <div className={styles.ordersList}>
        {orders.map((order) => (
          <div key={order.id} className={styles.orderCard}>

            {/* Header do Card */}
            <div className={styles.cardHeader}>
              <div className={styles.idGroup}>
                <span className={styles.label}>ID DO PEDIDO</span>
                <span className={styles.orderId}>{order.id}</span>
              </div>
              <div className={`${styles.statusBadge} ${styles[order.status.toLowerCase()] || styles.pending}`}>
                {order.status}
              </div>
            </div>

            {/* Detalhes */}
            <div className={styles.detailsGrid}>
              <div>
                <span className={styles.label}>DATA</span>
                <span>{order.date}</span>
              </div>
              <div>
                <span className={styles.label}>TOTAL</span>
                <span className={styles.total}>{order.total}</span>
              </div>
            </div>

            {/* Imagens dos itens */}
            <div className={styles.itemsRow}>
              {order.items.map((img, i) => (
                <img key={i} src={img} alt="Item" className={styles.itemThumb} />
              ))}
            </div>

            {/* Ação Pix */}
            {order.status === 'pending' && order.paymentMethod === 'pix' && order.pixData && (
              <button
                className={styles.detailsBtn}
                style={{ marginTop: '10px', backgroundColor: '#32bcad', borderColor: '#32bcad' }}
                onClick={() => setSelectedPix(order.pixData)}
              >
                VER QR CODE PIX
              </button>
            )}

            <button className={styles.detailsBtn} style={{ marginTop: '10px' }}>VER DETALHES →</button>
          </div>
        ))}
      </div>

      {/* Modal Pix */}
      {selectedPix && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white', padding: '20px', borderRadius: '8px', maxWidth: '400px', width: '90%',
            textAlign: 'center', position: 'relative'
          }}>
            <button
              onClick={() => setSelectedPix(null)}
              style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
            >
              ×
            </button>
            <h3>PAGAMENTO PIX</h3>
            <p style={{ marginBottom: '15px' }}>Escaneie o QR Code abaixo:</p>

            {selectedPix.qrCodeBase64 && (
              <img
                src={`data:image/png;base64,${selectedPix.qrCodeBase64}`}
                alt="QR Code Pix"
                style={{ width: '200px', height: '200px', border: '1px solid #ccc' }}
              />
            )}

            <div style={{ marginTop: '15px' }}>
              <p style={{ fontSize: '0.8rem', marginBottom: '5px' }}>Copia e Cola:</p>
              <textarea
                readOnly
                value={selectedPix.qrCode}
                style={{ width: '100%', height: '60px', fontSize: '0.7rem', padding: '5px' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
