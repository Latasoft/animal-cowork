import { Head, Link, router } from '@inertiajs/react';
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
import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { formatClp, getPlanTotalPrice, plans } from '@/data/plans';
import { PublicLayout } from '@/layouts/public-layout';
import {
    isCompleteContractData,
    readContractStorage,
    storeContractStorage,
} from '@/lib/checkout-storage';
import { createAutomaticContractDates } from '@/lib/contract-dates';
import { renew_preview as renewalContractPreview } from '@/routes/contract';
import type {
    ContractGenerationData,
    StoredCustomerContract,
} from '@/types/checkout';
import type { Plan } from '@/types/plan';
import { formatRut, normalizeRut } from '@/utils/rut';

type RenewalStep = 'lookup' | 'contract' | 'payment' | 'not-found';

type PlanId = Plan['id'];

type EditableCustomerField =
    | 'representative_name'
    | 'company_name'
    | 'representative_address'
    | 'representative_commune'
    | 'representative_region'
    | 'representative_email'
    | 'representative_whatsapp';

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

    representative_address: 'Avenida Los Emprendedores 123, Puerto Montt',
    representative_commune: 'Puerto Montt',
    representative_region: 'Los Lagos',

    representative_email: 'juan@emprende.cl',
    representative_whatsapp: '+56 9 1234 5678',

    is_natural_person: false,

    current_plan: 'fenix',

    expires_at: '15 de septiembre de 2026',
};

interface RestoredRenewalState {
    customer: StoredCustomerContract;
    selectedPlanId: PlanId;
}

function readRestoredRenewalState(): RestoredRenewalState | null {
    const storedContract = readContractStorage();

    if (storedContract?.flow !== 'renewal' || !storedContract.renewal) {
        return null;
    }

    const { data, renewal } = storedContract;

    return {
        customer: {
            representative_name: data.representative_name,
            representative_rut: formatRut(data.representative_rut),
            company_name: data.company_name,
            company_rut: formatRut(data.company_rut),
            representative_address: data.representative_address,
            representative_commune: data.representative_commune,
            representative_region: data.representative_region,
            representative_email: data.representative_email,
            representative_whatsapp: data.representative_whatsapp,
            is_natural_person: data.is_natural_person,
            current_plan: renewal.previous_plan_id,
            expires_at: renewal.expires_at,
        },
        selectedPlanId: data.plan_id,
    };
}

export default function RenewContract() {
    const [restoredRenewal] = useState(readRestoredRenewalState);
    const [step, setStep] = useState<RenewalStep>(
        restoredRenewal ? 'contract' : 'lookup',
    );

    const [companyRut, setCompanyRut] = useState(
        restoredRenewal?.customer.company_rut ?? '',
    );

    /**
     * Simula los datos recuperados desde backend.
     *
     * Cuando exista la API, este estado recibirá
     * los datos reales del cliente.
     */
    const [customerContract, setCustomerContract] =
        useState<StoredCustomerContract>({
            ...(restoredRenewal?.customer ?? simulatedContract),
            representative_rut: formatRut(
                restoredRenewal?.customer.representative_rut ??
                    simulatedContract.representative_rut,
            ),
            company_rut: formatRut(
                restoredRenewal?.customer.company_rut ??
                    simulatedContract.company_rut,
            ),
        });

    const [selectedPlanId, setSelectedPlanId] = useState<PlanId>(
        restoredRenewal?.selectedPlanId ?? simulatedContract.current_plan,
    );

    const [processing, setProcessing] = useState(false);
    const [contractPreparationError, setContractPreparationError] = useState<
        string | null
    >(null);

    const currentPlan = useMemo(
        () => plans.find((plan) => plan.id === customerContract.current_plan),
        [customerContract.current_plan],
    );

    const selectedPlan = useMemo(
        () => plans.find((plan) => plan.id === selectedPlanId),
        [selectedPlanId],
    );

    function handleSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const enteredRut = normalizeRut(companyRut);

        const storedRut = normalizeRut(customerContract.company_rut);

        if (enteredRut === storedRut) {
            setSelectedPlanId(customerContract.current_plan);

            setStep('contract');

            return;
        }

        setStep('not-found');
    }

    function handleUpdateCustomer(updatedContract: StoredCustomerContract) {
        /**
         * FRONTEND TEMPORAL.
         *
         * Más adelante aquí se realizará una petición
         * PATCH/PUT al backend para actualizar los datos
         * permitidos del cliente.
         *
         * Los RUT nunca se modifican desde este formulario.
         */
        setCustomerContract({
            ...updatedContract,
            representative_rut: formatRut(customerContract.representative_rut),
            company_rut: formatRut(customerContract.company_rut),
        });

    }

    function handlePayment() {
        if (!selectedPlan) {
            return;
        }

        const representativeRut = formatRut(
            customerContract.representative_rut,
        );
        const companyRut = formatRut(customerContract.company_rut);
        const contractData: ContractGenerationData = {
            ...createAutomaticContractDates(
                selectedPlan.contractDurationMonths,
            ),
            plan_id: selectedPlan.id,
            representative_name: customerContract.representative_name,
            representative_rut: representativeRut,
            company_name: customerContract.is_natural_person
                ? ''
                : customerContract.company_name,
            company_rut: customerContract.is_natural_person
                ? representativeRut
                : companyRut,
            representative_address: customerContract.representative_address,
            representative_commune: customerContract.representative_commune,
            representative_region: customerContract.representative_region,
            representative_email: customerContract.representative_email,
            representative_whatsapp: customerContract.representative_whatsapp,
            company_in_progress: false,
            is_natural_person: customerContract.is_natural_person,
        };

        if (!isCompleteContractData(contractData)) {
            setContractPreparationError(
                'Faltan datos obligatorios para generar el contrato. Vuelve y completa la información del cliente.',
            );

            return;
        }

        setContractPreparationError(null);
        setProcessing(true);

        /**
         * Simulación temporal del pago.
         *
         * Más adelante aquí se integrará
         * la pasarela de pagos real.
         */
        window.setTimeout(() => {
            storeContractStorage({
                data: contractData,
                flow: 'renewal',
                renewal: {
                    previous_plan_id: customerContract.current_plan,
                    expires_at: customerContract.expires_at,
                },
            });

            router.visit(renewalContractPreview.url(selectedPlan.id), {
                onFinish: () => setProcessing(false),
            });
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
                                Renueva tu contrato de oficina virtual
                            </h1>

                            <p className="mt-5 text-base leading-7 text-deep-blue/65 sm:text-lg">
                                Ingresa el RUT asociado a tu contrato para
                                consultar tu plan actual y continuar con la
                                renovación.
                            </p>
                        </header>

                        {step === 'lookup' && (
                            <RutLookup
                                companyRut={companyRut}
                                setCompanyRut={setCompanyRut}
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
                                contract={customerContract}
                                currentPlan={currentPlan}
                                selectedPlanId={selectedPlanId}
                                setSelectedPlanId={setSelectedPlanId}
                                onUpdateContract={handleUpdateCustomer}
                                onContinue={() => setStep('payment')}
                            />
                        )}

                        {step === 'payment' && (
                            <PaymentSimulation
                                plan={selectedPlan}
                                processing={processing}
                                error={contractPreparationError}
                                onBack={() => setStep('contract')}
                                onPay={handlePayment}
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
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

function RutLookup({ companyRut, setCompanyRut, onSubmit }: RutLookupProps) {
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
                        Ingresa el RUT con el que contrataste tu oficina
                        virtual.
                    </p>
                </div>
            </div>

            <div className="mt-7 max-w-xl">
                <label
                    htmlFor="company_rut"
                    className="mb-2 block text-sm font-extrabold text-deep-blue"
                >
                    RUT
                    <span className="ml-1 text-instinct">*</span>
                </label>

                <input
                    id="company_rut"
                    name="company_rut"
                    type="text"
                    value={companyRut}
                    onChange={(event) =>
                        setCompanyRut(formatRut(event.target.value))
                    }
                    placeholder="12.345.678-9"
                    autoComplete="off"
                    inputMode="text"
                    maxLength={12}
                    required
                    className="h-12 w-full rounded-xl border border-deep-blue/15 bg-white px-4 text-sm font-medium text-deep-blue transition outline-none placeholder:text-deep-blue/35 hover:border-deep-blue/30 focus:border-instinct focus:ring-4 focus:ring-instinct/10"
                />

                <p className="mt-2 text-xs leading-5 text-deep-blue/45">
                    Para esta simulación puedes utilizar 12.345.678-9.
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

function ContractNotFound({ onRetry }: ContractNotFoundProps) {
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
                El RUT ingresado no está asociado a un contrato disponible para
                renovación. Puedes volver a intentarlo o revisar nuestros planes
                disponibles.
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
 * DATOS DEL CONTRATO / CLIENTE
 * ======================================================= */

interface ContractSummaryProps {
    contract: StoredCustomerContract;
    currentPlan?: Plan;
    selectedPlanId: PlanId;
    setSelectedPlanId: (plan: PlanId) => void;
    onUpdateContract: (contract: StoredCustomerContract) => void;
    onContinue: () => void;
}

function ContractSummary({
    contract,
    currentPlan,
    selectedPlanId,
    setSelectedPlanId,
    onUpdateContract,
    onContinue,
}: ContractSummaryProps) {
    const [draft, setDraft] = useState<StoredCustomerContract>({
        ...contract,
        representative_rut: formatRut(contract.representative_rut),
        company_rut: formatRut(contract.company_rut),
    });

    const [updated, setUpdated] = useState(false);

    const hasChanges =
        draft.representative_name !== contract.representative_name ||
        draft.company_name !== contract.company_name ||
        draft.representative_address !== contract.representative_address ||
        draft.representative_commune !== contract.representative_commune ||
        draft.representative_region !== contract.representative_region ||
        draft.representative_email !== contract.representative_email ||
        draft.representative_whatsapp !== contract.representative_whatsapp;

    function updateField(field: EditableCustomerField, value: string) {
        setDraft((previous) => ({
            ...previous,
            [field]: value,
        }));

        setUpdated(false);
    }

    function handleUpdate(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        /**
         * Los RUT se fuerzan nuevamente desde los
         * datos originales para impedir cualquier
         * modificación accidental.
         */
        const updatedContract: StoredCustomerContract = {
            ...draft,

            representative_rut: formatRut(contract.representative_rut),

            company_rut: formatRut(contract.company_rut),
        };

        setDraft(updatedContract);
        onUpdateContract(updatedContract);
        setUpdated(true);
    }

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
                            Revisa tus datos
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-deep-blue/55">
                            Puedes actualizar tus datos antes de continuar con
                            la renovación. Los RUT asociados al contrato no
                            pueden modificarse desde este proceso.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleUpdate} className="mt-8">
                    <div className="grid gap-6 md:grid-cols-2">
                        {!draft.is_natural_person && (
                            <CustomerInput
                                icon={Building2}
                                label="Razón social"
                                name="company_name"
                                value={draft.company_name}
                                onChange={(value) =>
                                    updateField('company_name', value)
                                }
                                autoComplete="organization"
                            />
                        )}

                        {!draft.is_natural_person && (
                            <ReadOnlyRutInput
                                icon={Building2}
                                label="RUT de la empresa"
                                name="company_rut"
                                value={formatRut(draft.company_rut)}
                            />
                        )}

                        <CustomerInput
                            icon={UserRound}
                            label={
                                draft.is_natural_person
                                    ? 'Nombre completo'
                                    : 'Representante legal'
                            }
                            name="representative_name"
                            value={draft.representative_name}
                            onChange={(value) =>
                                updateField('representative_name', value)
                            }
                            autoComplete="name"
                        />

                        <ReadOnlyRutInput
                            icon={UserRound}
                            label={
                                draft.is_natural_person
                                    ? 'RUT'
                                    : 'RUT representante'
                            }
                            name="representative_rut"
                            value={formatRut(draft.representative_rut)}
                        />

                        <CustomerInput
                            icon={Mail}
                            label="Correo"
                            name="representative_email"
                            type="email"
                            value={draft.representative_email}
                            onChange={(value) =>
                                updateField('representative_email', value)
                            }
                            autoComplete="email"
                        />

                        <CustomerInput
                            icon={Phone}
                            label="WhatsApp"
                            name="representative_whatsapp"
                            type="tel"
                            value={draft.representative_whatsapp}
                            onChange={(value) =>
                                updateField('representative_whatsapp', value)
                            }
                            autoComplete="tel"
                        />

                        <CustomerInput
                            icon={MapPin}
                            label="Dirección"
                            name="representative_address"
                            value={draft.representative_address}
                            onChange={(value) =>
                                updateField('representative_address', value)
                            }
                            autoComplete="street-address"
                            className="md:col-span-2"
                        />

                        <CustomerInput
                            icon={MapPin}
                            label="Comuna"
                            name="representative_commune"
                            value={draft.representative_commune}
                            onChange={(value) =>
                                updateField('representative_commune', value)
                            }
                            autoComplete="address-level2"
                        />

                        <CustomerInput
                            icon={MapPin}
                            label="Región"
                            name="representative_region"
                            value={draft.representative_region}
                            onChange={(value) =>
                                updateField('representative_region', value)
                            }
                            autoComplete="address-level1"
                        />
                    </div>

                    <div className="mt-7 flex flex-col gap-3 border-t border-deep-blue/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            {updated && !hasChanges && (
                                <p
                                    role="status"
                                    className="flex items-center gap-2 text-sm font-bold text-instinct-dark"
                                >
                                    <CheckCircle2
                                        className="size-4"
                                        strokeWidth={2.5}
                                        aria-hidden="true"
                                    />
                                    Datos actualizados correctamente.
                                </p>
                            )}

                            {hasChanges && (
                                <p className="text-sm text-deep-blue/50">
                                    Tienes cambios pendientes por guardar.
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            variant="outline"
                            disabled={!hasChanges}
                            className="h-11 justify-center px-6"
                        >
                            Actualizar datos
                        </Button>
                    </div>
                </form>

                <div className="mt-8 grid gap-4 border-t border-deep-blue/10 pt-8 sm:grid-cols-2">
                    <ContractInfo
                        icon={FileText}
                        label="Plan actual"
                        value={currentPlan?.name ?? contract.current_plan}
                    />

                    <ContractInfo
                        icon={CalendarDays}
                        label="Fecha de vencimiento"
                        value={contract.expires_at}
                    />
                </div>
            </section>

            <PlanSelection
                currentPlanId={contract.current_plan}
                selectedPlanId={selectedPlanId}
                setSelectedPlanId={setSelectedPlanId}
            />

            <div className="border-t border-deep-blue/10 pt-8">
                {hasChanges && (
                    <p className="mb-4 text-right text-sm font-semibold text-deep-blue/55">
                        Guarda los cambios realizados antes de continuar al
                        pago.
                    </p>
                )}

                <div className="flex justify-end">
                    <Button
                        type="button"
                        onClick={onContinue}
                        disabled={hasChanges}
                        className="h-12 px-7"
                    >
                        Continuar al pago
                    </Button>
                </div>
            </div>
        </div>
    );
}

/* =========================================================
 * INPUT EDITABLE DE CLIENTE
 * ======================================================= */

interface CustomerInputProps {
    icon: LucideIcon;
    label: string;
    name: string;
    value: string;
    onChange: (value: string) => void;
    type?: 'text' | 'email' | 'tel';
    autoComplete?: string;
    className?: string;
}

function CustomerInput({
    icon: Icon,
    label,
    name,
    value,
    onChange,
    type = 'text',
    autoComplete,
    className = '',
}: CustomerInputProps) {
    return (
        <div className={className}>
            <label
                htmlFor={name}
                className="mb-2 flex items-center gap-2 text-sm font-extrabold text-deep-blue"
            >
                <Icon
                    className="size-4 text-instinct-dark"
                    strokeWidth={2}
                    aria-hidden="true"
                />

                {label}
            </label>

            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                autoComplete={autoComplete}
                required
                className="h-12 w-full rounded-xl border border-deep-blue/15 bg-white px-4 text-sm font-medium text-deep-blue transition outline-none placeholder:text-deep-blue/35 hover:border-deep-blue/30 focus:border-instinct focus:ring-4 focus:ring-instinct/10"
            />
        </div>
    );
}

/* =========================================================
 * INPUT RUT NO EDITABLE
 * ======================================================= */

interface ReadOnlyRutInputProps {
    icon: LucideIcon;
    label: string;
    name: string;
    value: string;
}

function ReadOnlyRutInput({
    icon: Icon,
    label,
    name,
    value,
}: ReadOnlyRutInputProps) {
    return (
        <div>
            <label
                htmlFor={name}
                className="mb-2 flex items-center gap-2 text-sm font-extrabold text-deep-blue"
            >
                <Icon
                    className="size-4 text-deep-blue/45"
                    strokeWidth={2}
                    aria-hidden="true"
                />

                {label}
            </label>

            <input
                id={name}
                name={name}
                type="text"
                value={value}
                readOnly
                aria-readonly="true"
                className="h-12 w-full cursor-not-allowed rounded-xl border border-deep-blue/10 bg-deep-blue/[0.04] px-4 text-sm font-bold text-deep-blue/55 outline-none"
            />

            <p className="mt-2 text-xs leading-5 text-deep-blue/40">
                El RUT asociado al contrato no puede modificarse.
            </p>
        </div>
    );
}

/* =========================================================
 * INFORMACIÓN FIJA DEL CONTRATO
 * ======================================================= */

interface ContractInfoProps {
    icon: LucideIcon;
    label: string;
    value: string;
}

function ContractInfo({ icon: Icon, label, value }: ContractInfoProps) {
    return (
        <div className="flex items-start gap-3 bg-deep-blue/[0.025] p-4">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-deep-blue/5 text-deep-blue">
                <Icon className="size-4" strokeWidth={2} aria-hidden="true" />
            </div>

            <div>
                <p className="text-xs font-bold tracking-wide text-deep-blue/45 uppercase">
                    {label}
                </p>

                <p className="mt-1 text-sm font-extrabold text-deep-blue">
                    {value}
                </p>
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
    const fenixPlan = plans.find((plan) => plan.id === 'fenix');

    const officeAndPatentPlans = plans.filter(
        (plan) => plan.id === 'lobo' || plan.id === 'leon',
    );

    return (
        <section>
            <div>
                <p className="text-xs font-extrabold tracking-[0.14em] text-instinct-dark uppercase">
                    Renovación
                </p>

                <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-deep-blue sm:text-4xl">
                    Elige cómo quieres renovar
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-deep-blue/60 sm:text-base">
                    Selecciona la alternativa que mejor se adapte a lo que
                    necesitas para continuar con tu empresa.
                </p>
            </div>

            <div className="mt-10">
                <div className="mb-5">
                    <p className="text-xs font-extrabold tracking-[0.14em] text-instinct-dark uppercase">
                        Opción principal
                    </p>

                    <h3 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-deep-blue sm:text-3xl">
                        Renovación de oficina virtual
                    </h3>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-deep-blue/60">
                        Si solo necesitas renovar tu oficina virtual, esta es la
                        opción indicada.
                    </p>
                </div>

                {fenixPlan && (
                    <RenewalPlanCard
                        plan={fenixPlan}
                        selected={selectedPlanId === fenixPlan.id}
                        isCurrent={currentPlanId === fenixPlan.id}
                        onSelect={() => setSelectedPlanId(fenixPlan.id)}
                        featured
                    />
                )}
            </div>

            <div className="my-10 border-t border-deep-blue/10" />

            <div>
                <p className="text-xs font-extrabold tracking-[0.14em] text-energy-blue uppercase">
                    Oficina virtual + patente
                </p>

                <h3 className="mt-2 max-w-3xl text-2xl font-extrabold tracking-[-0.03em] text-deep-blue sm:text-3xl">
                    Si necesitas renovar tu oficina virtual y gestionar tu
                    patente comercial, estas son las opciones que tenemos para
                    ti:
                </h3>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                    {officeAndPatentPlans.map((plan) => (
                        <RenewalPlanCard
                            key={plan.id}
                            plan={plan}
                            selected={selectedPlanId === plan.id}
                            isCurrent={currentPlanId === plan.id}
                            onSelect={() => setSelectedPlanId(plan.id)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

/* =========================================================
 * CARD INDIVIDUAL DE RENOVACIÓN
 * ======================================================= */

interface RenewalPlanCardProps {
    plan: Plan;
    selected: boolean;
    isCurrent: boolean;
    onSelect: () => void;
    featured?: boolean;
}

function RenewalPlanCard({
    plan,
    selected,
    isCurrent,
    onSelect,
    featured = false,
}: RenewalPlanCardProps) {
    const hasAdditionalService = Boolean(plan.features[1]);

    return (
        <button
            type="button"
            onClick={onSelect}
            aria-pressed={selected}
            className={[
                'group relative flex w-full overflow-hidden border text-left transition duration-300',
                featured
                    ? 'flex-col sm:grid sm:grid-cols-[240px_1fr]'
                    : 'h-full flex-col',
                selected
                    ? 'border-instinct bg-instinct/5 ring-2 ring-instinct/10'
                    : 'border-deep-blue/10 bg-white hover:-translate-y-1 hover:border-deep-blue/25 hover:shadow-lg',
            ].join(' ')}
        >
            <div
                className={[
                    'relative overflow-hidden bg-deep-blue/[0.03]',
                    featured ? 'h-56 sm:h-full sm:min-h-[280px]' : 'h-56',
                ].join(' ')}
            >
                <img
                    src={plan.image}
                    alt={plan.imageAlt}
                    loading="lazy"
                    className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
                />

                <div
                    className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-transparent"
                    aria-hidden="true"
                />

                {isCurrent && (
                    <span className="absolute top-4 left-4 rounded-full bg-instinct px-3 py-1 text-[10px] font-extrabold tracking-wide text-white uppercase shadow-sm">
                        Plan actual
                    </span>
                )}
            </div>

            <div
                className={[
                    'flex flex-1 flex-col',
                    featured ? 'p-6 sm:justify-center sm:p-8' : 'p-6',
                ].join(' ')}
            >
                {featured && (
                    <p className="text-xs font-extrabold tracking-[0.14em] text-instinct-dark uppercase">
                        Renovación recomendada
                    </p>
                )}

                <h4
                    className={[
                        'font-extrabold tracking-[-0.04em] text-deep-blue',
                        featured ? 'mt-2 text-3xl' : 'text-2xl',
                    ].join(' ')}
                >
                    Plan {plan.name}
                </h4>

                <div className="mt-4">
                    {hasAdditionalService ? (
                        <div className="flex flex-col gap-3">
                            <div className="flex items-start gap-3">
                                <CheckCircle2
                                    className="mt-0.5 size-5 shrink-0 text-instinct"
                                    strokeWidth={2.4}
                                    aria-hidden="true"
                                />

                                <p className="text-sm leading-6 font-semibold text-deep-blue/65">
                                    {plan.features[0]}
                                </p>
                            </div>

                            <div className="flex items-center gap-3 pl-1">
                                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-instinct/10 text-sm font-extrabold text-instinct-dark">
                                    +
                                </span>

                                <p className="text-sm leading-6 font-semibold text-deep-blue/65">
                                    {plan.features[1]}
                                </p>
                            </div>
                        </div>
                    ) : (
                        plan.features[0] && (
                            <div className="flex items-start gap-3">
                                <CheckCircle2
                                    className="mt-0.5 size-5 shrink-0 text-instinct"
                                    strokeWidth={2.4}
                                    aria-hidden="true"
                                />

                                <p className="text-sm leading-6 font-semibold text-deep-blue/65">
                                    {plan.features[0]}
                                </p>
                            </div>
                        )
                    )}
                </div>

                <p
                    className={[
                        'font-extrabold tracking-[-0.05em] text-instinct',
                        featured
                            ? 'mt-6 text-4xl sm:text-5xl'
                            : 'mt-6 text-3xl',
                    ].join(' ')}
                >
                    {formatClp(getPlanTotalPrice(plan))}
                </p>

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
                            ].join(' ')}
                        >
                            {selected && (
                                <CheckCircle2
                                    className="size-3"
                                    strokeWidth={3}
                                    aria-hidden="true"
                                />
                            )}
                        </span>

                        {selected ? 'Seleccionado' : 'Seleccionar plan'}
                    </div>
                </div>
            </div>
        </button>
    );
}

/* =========================================================
 * SIMULACIÓN DE PAGO
 * ======================================================= */

interface PaymentSimulationProps {
    plan?: Plan;
    processing: boolean;
    error: string | null;
    onBack: () => void;
    onPay: () => void;
}

function PaymentSimulation({
    plan,
    processing,
    error,
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
                    No fue posible identificar el plan seleccionado.
                </p>
            </div>
        );
    }

    const hasAdditionalService = Boolean(plan.features[1]);

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

                        <div className="mt-3">
                            {plan.features[0] && (
                                <p className="text-sm leading-6 text-deep-blue/55">
                                    {plan.features[0]}
                                </p>
                            )}

                            {hasAdditionalService && plan.features[1] && (
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="font-extrabold text-instinct">
                                        +
                                    </span>

                                    <p className="text-sm leading-6 text-deep-blue/55">
                                        {plan.features[1]}
                                    </p>
                                </div>
                            )}
                        </div>

                        <p className="mt-4 text-3xl font-extrabold tracking-[-0.04em] text-instinct">
                            {formatClp(getPlanTotalPrice(plan))}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-6 border-l-4 border-instinct bg-instinct/5 px-5 py-4">
                <p className="text-sm leading-6 text-deep-blue/65">
                    Por ahora esta pantalla simula el proceso de pago. Más
                    adelante será reemplazada por la integración con la pasarela
                    de pagos utilizada por Animal Co-work.
                </p>
            </div>

            {error && (
                <div
                    role="alert"
                    className="mt-6 border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700"
                >
                    {error}
                </div>
            )}

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
                        : `Pagar ${formatClp(getPlanTotalPrice(plan))}`}
                </Button>
            </div>
        </div>
    );
}
