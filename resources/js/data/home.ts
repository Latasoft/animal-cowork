import type { HeroContent } from '@/types/home';
import { formatClp } from '@/utils/currency';

const heroContent: Omit<HeroContent, 'price'> = {
    title: 'TÚ NEGOCIO NECESITA MÁS QUE UNA DIRECCIÓN,',
    title2: 'NECESITA UN IMPULSO.',
    subtitle: 'La oficina virtual más conveniente de Chile.',
    promotion: '2 años por el precio de 1.',
    primaryAction: {
        label: 'QUIERO MI OFICINA VIRTUAL',
        href: '#planes',
    },
    secondaryAction: {
        label: 'CONOCE NUESTROS PLANES',
        href: '#planes',
    },
    socialProof: 'Más de +6.000 emprendedores confían en nosotros',
    communityMessage: 'Únete a la manada de Animal Co-work.',
};

export function createHeroContent(lowestPlanPrice: number | null): HeroContent {
    return {
        ...heroContent,
        price: lowestPlanPrice === null ? null : formatClp(lowestPlanPrice),
    };
}
