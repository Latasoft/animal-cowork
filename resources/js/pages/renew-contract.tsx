import { Head, Link } from '@inertiajs/react';
import {
    Building2,
    CalendarDays,
    CheckCircle2,
    CreditCard,
    FileText,
    Mail,
    MapPin,
    Phone,
    Search,
    UserRound,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
    useMemo,
    useState,
} from 'react';
import type { FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { plans } from '@/data/plans';
import { PublicLayout } from '@/layouts/public-layout';

import type { StoredCustomerContract } from '@/types/checkout';
import type { Plan } from '@/types/plan';

type RenewalStep =
    | 'lookup'
    | 'contract'
    | 'payment'
    | 'success'
    | 'not-found';

type PlanId = Plan['id'];

/**
 * Datos simulados para el frontend.
 *
 * Más adelante serán reemplazados por una consulta
 * al backend utilizando el RUT ingresado.
 */
const simulatedContract: StoredCustomerContract = {
    representative_name: 'Juan Pérez González',
    representative_rut: '11.111.111-1',

    company_name: 'Emprende SpA',
    company_rut: '12.345.678-9',

    representative_address:
        'Avenida Los Emprendedores 123, Puerto Montt',

    representative_email: 'juan@emprende.cl',
    representative_whatsapp: '+56 9 1234 5678',

    is_natural_person: false,

    current_plan: 'fenix',

    expires_at: '15 de septiembre de 2026',
};

/**
 * Normaliza el RUT para permitir distintos formatos:
 *
 * 12.345.678-9
 * 12345678-9
 * 12 345 678 -9
 */
function normalizeRut(value: string) {
    return value
        .replace(/\./g, '')
        .replace(/-/g, '')
        .replace(/\s/g, '')
        .toLowerCase();
}

export default function RenewContract() {
    const [step, setStep] =
        useState<RenewalStep>('lookup');

    const [companyRut, setCompanyRut] =
        useState('');

    const [selectedPlanId, setSelectedPlanId] =
        useState<PlanId>(
            simulatedContract.current_plan,
        );

    const [processing, setProcessing] =
        useState(false);

    const currentPlan = useMemo(
        () =>
            plans.find(
                (plan) =>
                    plan.id ===
                    simulatedContract.current_plan,
            ),
        [],
    );

    const selectedPlan = useMemo(
        () =>
            plans.find(
                (plan) =>
                    plan.id === selectedPlanId,
            ),
        [selectedPlanId],
    );

    function handleSearch(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        const enteredRut =
            normalizeRut(companyRut);

        const storedRut = normalizeRut(
            simulatedContract.company_rut,
        );

        if (enteredRut === storedRut) {
            setSelectedPlanId(
                simulatedContract.current_plan,
            );

            setStep('contract');

            return;
        }

        setStep('not-found');
    }

    function handlePayment() {
        if (!selectedPlan) {
            return;
        }

        setProcessing(true);

        /**
         * Simulación temporal del pago.
         *
         * Más adelante aquí se integrará
         * la pasarela de pagos real.
         */
        window.setTimeout(() => {
            console.log(
                'Renovación simulada:',
                {
                    customer:
                        simulatedContract,

                    previous_plan:
                        currentPlan,

                    selected_plan:
                        selectedPlan,
                },
            );

            setProcessing(false);
            setStep('success');
        }, 1200);
    }

    return (
        <PublicLayout>
            <Head title="Renovar contrato" />

            <section className="bg-white py-10 sm:py-12 lg:py-16">
                <Container>
                    <div className="mx-auto max-w-5xl">
                        <header className="max-w-3xl">
                            <p className="text-sm font-extrabold tracking-[0.16em] text-instinct-dark uppercase">
                                Renovación
                            </p>

                            <h1 className="mt-3 text-4xl leading-[1.03] font-extrabold tracking-[-0.05em] text-deep-blue sm:text-5xl">
                                Renueva tu contrato de
                                oficina virtual
                            </h1>

                            <p className="mt-5 text-base leading-7 text-deep-blue/65 sm:text-lg">
                                Ingresa el RUT asociado a tu
                                contrato para consultar tu
                                plan actual y continuar con la
                                renovación.
                            </p>
                        </header>

                        {step === 'lookup' && (
                            <RutLookup
                                companyRut={companyRut}
                                setCompanyRut={
                                    setCompanyRut
                                }
                                onSubmit={handleSearch}
                            />
                        )}

                        {step === 'not-found' && (
                            <ContractNotFound
                                onRetry={() => {
                                    setCompanyRut('');
                                    setStep('lookup');
                                }}
                            />
                        )}

                        {step === 'contract' && (
                            <ContractSummary
                                contract={
                                    simulatedContract
                                }
                                currentPlan={
                                    currentPlan
                                }
                                selectedPlanId={
                                    selectedPlanId
                                }
                                setSelectedPlanId={
                                    setSelectedPlanId
                                }
                                onContinue={() =>
                                    setStep('payment')
                                }
                            />
                        )}

                        {step === 'payment' && (
                            <PaymentSimulation
                                plan={selectedPlan}
                                processing={
                                    processing
                                }
                                onBack={() =>
                                    setStep('contract')
                                }
                                onPay={
                                    handlePayment
                                }
                            />
                        )}

                        {step === 'success' && (
                            <RenewalSuccess
                                contract={
                                    simulatedContract
                                }
                                plan={selectedPlan}
                            />
                        )}
                    </div>
                </Container>
            </section>
        </PublicLayout>
    );
}

/* =========================================================
 * BÚSQUEDA DE CONTRATO
 * ======================================================= */

interface RutLookupProps {
    companyRut: string;
    setCompanyRut: (value: string) => void;
    onSubmit: (
        event: FormEvent<HTMLFormElement>,
    ) => void;
}

function RutLookup({
    companyRut,
    setCompanyRut,
    onSubmit,
}: RutLookupProps) {
    return (
        <form
            onSubmit={onSubmit}
            className="mt-10 border border-deep-blue/10 bg-deep-blue/[0.02] p-6 sm:p-8"
            noValidate
        >
            <div className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-instinct/10 text-instinct-dark">
                    <Search
                        className="size-5"
                        strokeWidth={2.2}
                        aria-hidden="true"
                    />
                </div>

                <div>
                    <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-deep-blue">
                        Buscar contrato
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-deep-blue/60">
                        Ingresa el RUT con el que
                        contrataste tu oficina virtual.
                    </p>
                </div>
            </div>

            <div className="mt-7 max-w-xl">
                <label
                    htmlFor="company_rut"
                    className="mb-2 block text-sm font-extrabold text-deep-blue"
                >
                    RUT
                    <span className="ml-1 text-instinct">
                        *
                    </span>
                </label>

                <input
                    id="company_rut"
                    name="company_rut"
                    type="text"
                    value={companyRut}
                    onChange={(event) =>
                        setCompanyRut(
                            event.target.value,
                        )
                    }
                    placeholder="12.345.678-9"
                    autoComplete="off"
                    required
                    className="h-12 w-full rounded-xl border border-deep-blue/15 bg-white px-4 text-sm font-medium text-deep-blue outline-none transition placeholder:text-deep-blue/35 hover:border-deep-blue/30 focus:border-instinct focus:ring-4 focus:ring-instinct/10"
                />

                <p className="mt-2 text-xs leading-5 text-deep-blue/45">
                    Para esta simulación puedes utilizar
                    12.345.678-9.
                </p>
            </div>

            <div className="mt-6">
                <Button
                    type="submit"
                    disabled={!companyRut.trim()}
                    className="h-12 px-7"
                >
                    Buscar contrato
                </Button>
            </div>
        </form>
    );
}

/* =========================================================
 * CONTRATO NO ENCONTRADO
 * ======================================================= */

interface ContractNotFoundProps {
    onRetry: () => void;
}

function ContractNotFound({
    onRetry,
}: ContractNotFoundProps) {
    return (
        <div className="mt-10 border border-deep-blue/10 bg-white p-7 shadow-sm sm:p-9">
            <div className="flex size-12 items-center justify-center rounded-full bg-deep-blue/5 text-deep-blue">
                <FileText
                    className="size-6"
                    strokeWidth={2}
                    aria-hidden="true"
                />
            </div>

            <h2 className="mt-5 text-2xl font-extrabold text-deep-blue">
                No encontramos tu contrato
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-deep-blue/60">
                El RUT ingresado no está asociado a un
                contrato disponible para renovación.
                Puedes volver a intentarlo o revisar
                nuestros planes disponibles.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                    href="/#planes"
                    className="inline-flex h-12 items-center justify-center rounded-xl bg-instinct px-6 text-sm font-extrabold text-white transition hover:brightness-95"
                >
                    Ver planes
                </Link>

                <button
                    type="button"
                    onClick={onRetry}
                    className="inline-flex h-12 items-center justify-center px-6 text-sm font-extrabold text-deep-blue transition hover:text-instinct-dark"
                >
                    Probar otro RUT
                </button>
            </div>
        </div>
    );
}

/* =========================================================
 * RESUMEN DEL CONTRATO
 * ======================================================= */

interface ContractSummaryProps {
    contract: StoredCustomerContract;
    currentPlan?: Plan;
    selectedPlanId: PlanId;
    setSelectedPlanId: (plan: PlanId) => void;
    onContinue: () => void;
}

function ContractSummary({
    contract,
    currentPlan,
    selectedPlanId,
    setSelectedPlanId,
    onContinue,
}: ContractSummaryProps) {
    return (
        <div className="mt-10 space-y-10">
            <section className="border border-deep-blue/10 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-start gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-instinct/10 text-instinct-dark">
                        <CheckCircle2
                            className="size-5"
                            strokeWidth={2.2}
                            aria-hidden="true"
                        />
                    </div>

                    <div>
                        <p className="text-xs font-extrabold tracking-[0.14em] text-instinct-dark uppercase">
                            Contrato encontrado
                        </p>

                        <h2 className="mt-1 text-2xl font-extrabold text-deep-blue">
                            {contract.company_name}
                        </h2>

                        <p className="mt-1 text-sm text-deep-blue/50">
                            {contract.company_rut}
                        </p>
                    </div>
                </div>

                <div className="mt-8 grid gap-x-8 gap-y-6 md:grid-cols-2">
                    <SummaryItem
                        icon={UserRound}
                        label="Representante"
                        value={
                            contract.representative_name
                        }
                    />

                    <SummaryItem
                        icon={Building2}
                        label="RUT representante"
                        value={
                            contract.representative_rut
                        }
                    />

                    <SummaryItem
                        icon={FileText}
                        label="Plan actual"
                        value={
                            currentPlan?.name ??
                            contract.current_plan
                        }
                    />

                    <SummaryItem
                        icon={CalendarDays}
                        label="Fecha de vencimiento"
                        value={
                            contract.expires_at
                        }
                    />

                    <SummaryItem
                        icon={Mail}
                        label="Correo"
                        value={
                            contract.representative_email
                        }
                    />

                    <SummaryItem
                        icon={Phone}
                        label="WhatsApp"
                        value={
                            contract.representative_whatsapp
                        }
                    />

                    <SummaryItem
                        icon={MapPin}
                        label="Dirección"
                        value={
                            contract.representative_address
                        }
                    />
                </div>
            </section>

            <PlanSelection
                currentPlanId={
                    contract.current_plan
                }
                selectedPlanId={
                    selectedPlanId
                }
                setSelectedPlanId={
                    setSelectedPlanId
                }
            />

            <div className="flex justify-end border-t border-deep-blue/10 pt-8">
                <Button
                    type="button"
                    onClick={onContinue}
                    className="h-12 px-7"
                >
                    Continuar al pago
                </Button>
            </div>
        </div>
    );
}

/* =========================================================
 * SELECCIÓN DE PLAN
 * ======================================================= */

interface PlanSelectionProps {
    currentPlanId: PlanId;
    selectedPlanId: PlanId;
    setSelectedPlanId: (plan: PlanId) => void;
}

function PlanSelection({
    currentPlanId,
    selectedPlanId,
    setSelectedPlanId,
}: PlanSelectionProps) {
    return (
        <section>
            <p className="text-xs font-extrabold tracking-[0.14em] text-instinct-dark uppercase">
                Renovación
            </p>

            <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-deep-blue">
                ¿Quieres mantener tu plan?
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-deep-blue/60">
                Puedes renovar el mismo plan que tienes
                actualmente o cambiar a cualquiera de
                nuestros planes disponibles.
            </p>

            <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {plans.map((plan) => {
                    const selected =
                        selectedPlanId === plan.id;

                    const isCurrent =
                        currentPlanId === plan.id;

                    const planSummary =
                        plan.features[0];

                    return (
                        <button
                            key={plan.id}
                            type="button"
                            onClick={() =>
                                setSelectedPlanId(
                                    plan.id,
                                )
                            }
                            aria-pressed={selected}
                            className={[
                                'group relative flex h-full flex-col overflow-hidden border text-left transition duration-300',
                                selected
                                    ? 'border-instinct bg-instinct/5 ring-2 ring-instinct/10'
                                    : 'border-deep-blue/10 bg-white hover:-translate-y-1 hover:border-deep-blue/25 hover:shadow-lg',
                            ].join(' ')}
                        >
                            {/* Imagen */}
                            <div className="relative h-56 w-full overflow-hidden bg-deep-blue/[0.03]">
                                <img
                                    src={plan.image}
                                    alt={
                                        plan.imageAlt
                                    }
                                    loading="lazy"
                                    className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
                                />

                                <div
                                    className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent"
                                    aria-hidden="true"
                                />

                                {isCurrent && (
                                    <span className="absolute top-4 left-4 rounded-full bg-instinct px-3 py-1 text-[10px] font-extrabold tracking-wide text-white uppercase shadow-sm">
                                        Plan actual
                                    </span>
                                )}
                            </div>

                            {/* Contenido */}
                            <div className="flex flex-1 flex-col p-6">
                                <h3 className="text-2xl font-extrabold text-deep-blue">
                                    {plan.name}
                                </h3>

                                <p className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-instinct">
                                    {plan.price}
                                </p>

                                {planSummary && (
                                    <p className="mt-3 text-sm font-semibold leading-12 text-deep-blue/60">
                                        {
                                            planSummary
                                        }
                                    </p>
                                )}

                                <div className="mt-auto pt-6">
                                    <div
                                        className={[
                                            'flex items-center gap-2 text-sm font-extrabold',
                                            selected
                                                ? 'text-instinct-dark'
                                                : 'text-deep-blue/45',
                                        ].join(' ')}
                                    >
                                        <span
                                            className={[
                                                'flex size-5 items-center justify-center rounded-full border',
                                                selected
                                                    ? 'border-instinct bg-instinct text-white'
                                                    : 'border-deep-blue/20',
                                            ].join(
                                                ' ',
                                            )}
                                        >
                                            {selected && (
                                                <CheckCircle2
                                                    className="size-3"
                                                    strokeWidth={
                                                        3
                                                    }
                                                    aria-hidden="true"
                                                />
                                            )}
                                        </span>

                                        {selected
                                            ? 'Seleccionado'
                                            : 'Seleccionar'}
                                    </div>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}

/* =========================================================
 * SIMULACIÓN DE PAGO
 * ======================================================= */

interface PaymentSimulationProps {
    plan?: Plan;
    processing: boolean;
    onBack: () => void;
    onPay: () => void;
}

function PaymentSimulation({
    plan,
    processing,
    onBack,
    onPay,
}: PaymentSimulationProps) {
    if (!plan) {
        return (
            <div
                role="alert"
                className="mt-10 border border-red-200 bg-red-50 p-6"
            >
                <p className="font-bold text-red-700">
                    No fue posible identificar el plan
                    seleccionado.
                </p>
            </div>
        );
    }

    return (
        <div className="mt-10 border border-deep-blue/10 bg-white p-7 shadow-sm sm:p-9">
            <div className="flex items-center gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-instinct/10 text-instinct-dark">
                    <CreditCard
                        className="size-5"
                        strokeWidth={2.2}
                        aria-hidden="true"
                    />
                </div>

                <div>
                    <p className="text-xs font-extrabold tracking-[0.14em] text-instinct-dark uppercase">
                        Renovación
                    </p>

                    <h2 className="mt-1 text-2xl font-extrabold text-deep-blue">
                        Pago
                    </h2>
                </div>
            </div>

            <div className="mt-8 overflow-hidden border border-deep-blue/10 bg-deep-blue/[0.015]">
                <div className="grid sm:grid-cols-[180px_1fr]">
                    <div className="h-48 overflow-hidden sm:h-full">
                        <img
                            src={plan.image}
                            alt={plan.imageAlt}
                            className="h-full w-full object-cover object-center"
                        />
                    </div>

                    <div className="flex flex-col justify-center p-6">
                        <p className="text-sm font-semibold text-deep-blue/50">
                            Plan seleccionado
                        </p>

                        <p className="mt-1 text-2xl font-extrabold text-deep-blue">
                            {plan.name}
                        </p>

                        {plan.features[0] && (
                            <p className="mt-2 text-sm leading-6 text-deep-blue/55">
                                {
                                    plan.features[0]
                                }
                            </p>
                        )}

                        <p className="mt-4 text-3xl font-extrabold tracking-[-0.04em] text-instinct">
                            {plan.price}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-6 border-l-4 border-instinct bg-instinct/5 px-5 py-4">
                <p className="text-sm leading-6 text-deep-blue/65">
                    Por ahora esta pantalla simula el
                    proceso de pago. Más adelante será
                    reemplazada por la integración con la
                    pasarela de pagos utilizada por Animal
                    Co-work.
                </p>
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                    type="button"
                    onClick={onBack}
                    disabled={processing}
                    className="inline-flex h-12 items-center justify-center px-6 text-sm font-extrabold text-deep-blue transition hover:text-instinct-dark disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Volver
                </button>

                <Button
                    type="button"
                    onClick={onPay}
                    disabled={processing}
                    className="h-12 px-7"
                >
                    {processing
                        ? 'Procesando pago...'
                        : `Pagar ${plan.price}`}
                </Button>
            </div>
        </div>
    );
}

/* =========================================================
 * RENOVACIÓN COMPLETADA
 * ======================================================= */

interface RenewalSuccessProps {
    contract: StoredCustomerContract;
    plan?: Plan;
}

function RenewalSuccess({
    contract,
    plan,
}: RenewalSuccessProps) {
    return (
        <div
            role="status"
            className="mt-10 border border-instinct/20 bg-instinct/5 p-7 sm:p-9"
        >
            <div className="flex size-12 items-center justify-center rounded-full bg-instinct text-white">
                <CheckCircle2
                    className="size-6"
                    strokeWidth={2.2}
                    aria-hidden="true"
                />
            </div>

            <p className="mt-5 text-xs font-extrabold tracking-[0.14em] text-instinct-dark uppercase">
                Pago confirmado
            </p>

            <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-deep-blue">
                Renovación lista para continuar
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-deep-blue/65">
                Hemos simulado correctamente el pago de la
                renovación de{' '}
                <strong className="text-deep-blue">
                    {contract.company_name}
                </strong>{' '}
                con el plan{' '}
                <strong className="text-deep-blue">
                    {plan?.name}
                </strong>
                .
            </p>

            {plan && (
                <div className="mt-6 flex max-w-xl items-center gap-4 border border-deep-blue/10 bg-white p-4">
                    <img
                        src={plan.image}
                        alt={plan.imageAlt}
                        className="size-20 shrink-0 object-cover"
                    />

                    <div>
                        <p className="text-xs font-bold tracking-wide text-deep-blue/45 uppercase">
                            Nuevo plan
                        </p>

                        <p className="mt-1 text-lg font-extrabold text-deep-blue">
                            {plan.name}
                        </p>

                        <p className="mt-1 font-extrabold text-instinct">
                            {plan.price}
                        </p>
                    </div>
                </div>
            )}

            <div className="mt-6 border-l-4 border-instinct bg-white px-5 py-5">
                <p className="font-extrabold text-deep-blue">
                    Siguiente paso
                </p>

                <p className="mt-2 text-sm leading-6 text-deep-blue/65">
                    El sistema utilizará la información que
                    ya tenemos almacenada para generar
                    automáticamente el nuevo contrato.
                </p>

                <p className="mt-2 text-sm leading-6 text-deep-blue/65">
                    Después del pago se avanzará directamente
                    al paso 3: previsualización y confirmación
                    del contrato.
                </p>
            </div>

            <button
                type="button"
                disabled
                className="mt-7 inline-flex h-12 cursor-not-allowed items-center justify-center rounded-xl bg-deep-blue/40 px-7 text-sm font-extrabold text-white"
            >
                Continuar a previsualización
            </button>

        </div>
    );
}

/* =========================================================
 * ITEM DEL RESUMEN
 * ======================================================= */

interface SummaryItemProps {
    icon: LucideIcon;
    label: string;
    value: string;
}

function SummaryItem({
    icon: Icon,
    label,
    value,
}: SummaryItemProps) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-deep-blue/5 text-deep-blue">
                <Icon
                    className="size-4"
                    strokeWidth={2}
                    aria-hidden="true"
                />
            </div>

            <div className="min-w-0">
                <p className="text-xs font-bold tracking-wide text-deep-blue/45 uppercase">
                    {label}
                </p>

                <p className="mt-1 break-words text-sm font-extrabold text-deep-blue">
                    {value}
                </p>
            </div>
        </div>
    );
}
