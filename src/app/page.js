import Hero from '@/components/Hero/Hero';
import Marquee from '@/components/Marquee/Marquee';
import CategoryCarousel from '@/components/CategoryCarousel/CategoryCarousel';
import FounderSpotlight from '@/components/FounderSpotlight/FounderSpotlight'; // NOVO COMPONENTE
import FeaturedDrops from '@/components/FeaturedDrops/FeaturedDrops';
import ShippingSection from '@/components/ShippingSection/ShippingSection';
import ResellerSection from '@/components/ResellerSection/ResellerSection'; // <--- Importe aqui

import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Seção 1: Hero (Agora com a nova tipografia) */}
      <Hero />

      {/* Seção 2: Faixa de Movimento */}
      <Marquee />

      {/* Seção 3: O Spotlight da Fundadora (Estilo Instagram) */}
      <FounderSpotlight />
<ShippingSection /> 
<ResellerSection />

      {/* Seção 4: Carrossel de Categorias */}
      <CategoryCarousel />
      
      {/* Seção 5: Lançamentos */}
      <FeaturedDrops />
      
      <div style={{ height: '100px' }}></div>
    </main>
  );
}