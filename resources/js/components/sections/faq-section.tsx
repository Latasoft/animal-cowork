import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';

import { Container } from '@/components/ui/container';
import type { FaqItem } from '@/types/faq';

interface FaqSectionProps {
    items: FaqItem[];
}

export function FaqSection({ items }: FaqSectionProps) {
    const [openItemId, setOpenItemId] = useState<string | null>(null);

    function toggleItem(itemId: string) {
        setOpenItemId((currentId) => (currentId === itemId ? null : itemId));
    }

    return (
        <section
            id="preguntas"
            className="relative scroll-mt-24 overflow-hidden bg-white py-14 sm:py-16 lg:py-20"
        >
            <Container>
                <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
                    <div className="relative">
                        <p className="text-sm font-extrabold tracking-[0.18em] text-instinct-dark uppercase">
                            Preguntas frecuentes
                        </p>

                        <h2 className="mt-4 max-w-xl text-4xl leading-[1.05] font-extrabold tracking-[-0.045em] text-balance text-deep-blue sm:text-5xl">
                            Resolvemos tus dudas antes de contratar.
                        </h2>

                        <p className="mt-5 max-w-lg text-base leading-7 text-muted sm:text-lg">
                            Revisa las consultas más habituales
                        </p>
                    </div>

                    <div className="divide-y divide-deep-blue/10 border-y border-deep-blue/10">
                        {items.map((item) => {
                            const isOpen = openItemId === item.id;
                            const buttonId = `faq-button-${item.id}`;
                            const panelId = `faq-panel-${item.id}`;

                            return (
                                <article key={item.id}>
                                    <h3>
                                        <button
                                            id={buttonId}
                                            type="button"
                                            className="group flex w-full items-center justify-between gap-6 py-6 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-instinct sm:py-7"
                                            aria-expanded={isOpen}
                                            aria-controls={panelId}
                                            onClick={() => toggleItem(item.id)}
                                        >
                                            <span className="text-base leading-6 font-extrabold tracking-[-0.02em] text-deep-blue transition-colors duration-200 group-hover:text-instinct-dark sm:text-lg">
                                                {item.question}
                                            </span>

                                            <span
                                                className={[
                                                    'flex size-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300',
                                                    isOpen
                                                        ? 'rotate-180 border-instinct bg-instinct text-white'
                                                        : 'border-deep-blue/15 bg-white text-deep-blue group-hover:border-instinct group-hover:text-instinct-dark',
                                                ].join(' ')}
                                                aria-hidden
                                            >
                                                {isOpen ? (
                                                    <Minus
                                                        className="size-5"
                                                        strokeWidth={2.3}
                                                    />
                                                ) : (
                                                    <Plus
                                                        className="size-5"
                                                        strokeWidth={2.3}
                                                    />
                                                )}
                                            </span>
                                        </button>
                                    </h3>

                                    <div
                                        id={panelId}
                                        role="region"
                                        aria-labelledby={buttonId}
                                        className={[
                                            'grid transition-all duration-300 ease-out',
                                            isOpen
                                                ? 'grid-rows-[1fr] opacity-100'
                                                : 'grid-rows-[0fr] opacity-0',
                                        ].join(' ')}
                                    >
                                        <div className="overflow-hidden">
                                            <p className="max-w-3xl pr-14 pb-7 text-sm leading-7 text-muted sm:text-base">
                                                {item.answer}
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </Container>
        </section>
    );
}
