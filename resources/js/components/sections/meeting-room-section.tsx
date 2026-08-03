import { Building2 } from 'lucide-react';

import { ButtonSecondary } from '@/components/ui/button';
import { Container } from '@/components/ui/container';

interface IncludedHours {
    plan: string;
    hours: string;
}

const includedHours: IncludedHours[] = [
    {
        plan: 'Plan Lobo',
        hours: '1 hora / mes',
    },
    {
        plan: 'Plan Fénix',
        hours: '2 horas / mes',
    },
    {
        plan: 'Plan León',
        hours: '2 horas / mes',
    },
];

export function MeetingRoomSection() {
    return (
        <section
            id="sala-reuniones"
            className="border-t border-deep-blue/10 bg-white pt-8 pb-12 sm:pt-10 sm:pb-16 lg:pt-12 lg:pb-20"
        >
            <Container>
                <div className="grid lg:grid-cols-[1.05fr_1.1fr_0.9fr_1fr]">
                    <IntroductionBlock />

                    <RoomImage />

                    <IncludedHoursBlock />

                    <BookingBlock />
                </div>
            </Container>
        </section>
    );
}

function IntroductionBlock() {
    return (
        <div className="relative flex min-h-full flex-col justify-center border-b border-deep-blue/10 px-6 py-10 sm:px-8 lg:border-r lg:border-b-0 lg:px-9">
            <p className="text-xs font-extrabold tracking-[0.12em] text-instinct-dark uppercase">
                Tu negocio merece un lugar para reunirse
            </p>

            <h2 className="mt-4 text-3xl leading-[1.05] font-extrabold tracking-[-0.045em] text-deep-blue sm:text-4xl lg:text-[2.6rem]">
                Todo gran negocio necesita un territorio.
            </h2>

            <p className="mt-5 text-sm leading-7 text-deep-blue sm:text-base">
                Todos los planes de Animal Co-work incluyen acceso a sala de
                reuniones para que puedas recibir clientes, cerrar acuerdos y
                hacer crecer tu negocio.
            </p>
        </div>
    );
}

function RoomImage() {
    return (
        <div className="relative min-h-72 overflow-hidden border-b border-deep-blue/10 lg:min-h-full lg:border-r lg:border-b-0">
            <img
                src="/images/meeting-room/sala-reuniones.webp"
                alt="Sala de reuniones de Animal Co-work"
                className="absolute inset-0 h-full w-full object-cover object-center transition duration-700 hover:scale-105"
                loading="lazy"
            />

            <div
                className="absolute inset-0 bg-gradient-to-t from-deep-blue/20 via-transparent to-transparent"
                aria-hidden
            />
        </div>
    );
}

function IncludedHoursBlock() {
    return (
        <div className="flex flex-col justify-center border-b border-deep-blue/10 px-6 py-10 sm:px-8 lg:border-r lg:border-b-0">
            <div className="flex items-center gap-3">
                <h3 className="text-lg leading-tight font-extrabold tracking-[-0.025em] text-deep-blue">
                    Horas de sala incluidas por plan
                </h3>
            </div>

            <div className="mt-7 divide-y divide-deep-blue/10">
                {includedHours.map((item) => (
                    <div
                        key={item.plan}
                        className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                    >
                        <div className="flex items-center gap-3">
                            <Building2
                                className="size-8 shrink-0 text-instinct-dark"
                                strokeWidth={2}
                                aria-hidden
                            />

                            <p className="text-sm font-extrabold text-deep-blue uppercase">
                                {item.plan}
                            </p>
                        </div>

                        <p className="shrink-0 text-sm font-bold text-muted">
                            {item.hours}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function BookingBlock() {
    return (
        <div className="relative flex min-h-full flex-col justify-center px-6 py-10 sm:px-8 lg:px-9">
            <div className="relative">
                <p className="text-xs font-extrabold tracking-[0.12em] text-instinct-dark uppercase">
                    Beneficio exclusivo para miembros de la manada
                </p>

                <h3 className="mt-4 text-2xl leading-tight font-extrabold tracking-[-0.035em] text-deep-blue">
                    ¿Necesitas más tiempo?
                </h3>

                <p className="mt-4 text-sm leading-6 text-deep-blue/75">
                    Podrás reservar horas adicionales con una tarifa
                    preferencial para clientes de Animal Co-work.
                </p>

                <div className="mt-6 inline-flex items-center rounded-xl border-2 border-instinct bg-white px-4 py-3">
                    <span className="text-lg font-extrabold text-instinct-dark">
                        $7.000
                    </span>

                    <span className="ml-2 text-sm font-bold text-deep-blue/60">
                        + IVA / hora
                    </span>
                </div>

                <p className="mt-4 text-xs leading-5 text-muted">
                    Valor normal: $20.000 + IVA por hora.
                </p>

                <p className="mt-2 text-xs leading-5 font-bold text-deep-blue">
                    Ahorro exclusivo para clientes de Animal Co-work.
                </p>

                <ButtonSecondary
                    href="#contacto"
                    className="mt-7 w-full justify-center bg-deep-blue text-white hover:bg-deep-blue-light hover:text-white"
                >
                    Reservar mi espacio
                </ButtonSecondary>
            </div>
        </div>
    );
}
