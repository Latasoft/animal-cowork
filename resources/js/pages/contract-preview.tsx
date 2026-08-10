import { Head, router } from '@inertiajs/react';
import {
    CheckCircle2,
    ExternalLink,
    FileCheck2,
    LoaderCircle,
    RotateCcw,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Button, ButtonLink } from '@/components/ui/button';
import { CheckoutSteps } from '@/components/ui/checkout-steps';
import { Container } from '@/components/ui/container';
import { plans } from '@/data/plans';
import { PublicLayout } from '@/layouts/public-layout';
import { readContractData } from '@/lib/checkout-storage';
import {
    createAutomaticContractDates,
    formatContractDate,
} from '@/lib/contract-dates';
import {
    createContractConfirmationPayload,
    createContractFile,
} from '@/lib/contract-file';
import { data as checkoutData } from '@/routes/checkout';

import type { ContractGenerationData, CheckoutPlan } from '@/types/checkout';

type GenerationStatus =
    'loading' | 'generating' | 'ready' | 'missing' | 'error';

interface ContractPreviewPageProps {
    plan: CheckoutPlan;
}

interface PreparedContract {
    file: File;
    payload: FormData;
}

export default function ContractPreview({ plan }: ContractPreviewPageProps) {
    const selectedPlan = useMemo(
        () => plans.find((catalogPlan) => catalogPlan.id === plan.id),
        [plan.id],
    );
    const [status, setStatus] = useState<GenerationStatus>('loading');
    const [generationAttempt, setGenerationAttempt] = useState(0);
    const [contractData, setContractData] =
        useState<ContractGenerationData | null>(null);
    const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isConfirming, setIsConfirming] = useState(false);
    const [preparedContract, setPreparedContract] =
        useState<PreparedContract | null>(null);

    useEffect(() => {
        let isActive = true;
        let createdUrl: string | null = null;

        async function generate(): Promise<void> {
            setStatus('generating');
            setErrorMessage(null);
            setPdfBlob(null);
            setPdfUrl(null);
            setPreparedContract(null);

            const storedData = readContractData();

            if (!storedData || storedData.plan_id !== plan.id) {
                if (isActive) {
                    setContractData(null);
                    setStatus('missing');
                }

                return;
            }

            if (!selectedPlan) {
                if (isActive) {
                    setStatus('error');
                    setErrorMessage(
                        'El plan seleccionado ya no está disponible.',
                    );
                }

                return;
            }

            try {
                const generationData: ContractGenerationData = {
                    ...storedData,
                    ...createAutomaticContractDates(
                        selectedPlan.contractDurationMonths,
                    ),
                };
                const { generateContractPdf } =
                    await import('@/components/checkout/contracts/contract-pdf');
                const generatedBlob = await generateContractPdf(
                    generationData,
                    selectedPlan,
                );

                if (!isActive) {
                    return;
                }

                createdUrl = URL.createObjectURL(generatedBlob);
                setContractData(generationData);
                setPdfBlob(generatedBlob);
                setPdfUrl(createdUrl);
                setStatus('ready');
            } catch {
                if (isActive) {
                    setStatus('error');
                    setErrorMessage(
                        'No fue posible generar el contrato. Intenta nuevamente.',
                    );
                }
            }
        }

        void generate();

        return () => {
            isActive = false;

            if (createdUrl) {
                URL.revokeObjectURL(createdUrl);
            }
        };
    }, [generationAttempt, plan.id, selectedPlan]);

    async function confirmContract(): Promise<void> {
        if (isConfirming || !pdfBlob || !contractData || !selectedPlan) {
            return;
        }

        setIsConfirming(true);

        try {
            await new Promise<void>((resolve) =>
                requestAnimationFrame(() => resolve()),
            );

            const file = createContractFile(
                pdfBlob,
                contractData,
                selectedPlan,
            );
            const payload = createContractConfirmationPayload(
                file,
                contractData,
                selectedPlan,
            );

            setPreparedContract({ file, payload });
        } finally {
            setIsConfirming(false);
        }
    }

    const isBusy = status === 'loading' || status === 'generating';

    return (
        <PublicLayout>
            <Head title={`Previsualización del contrato - ${plan.name}`} />

            <section className="bg-white py-8 sm:py-10 lg:py-12">
                <Container>
                    <CheckoutSteps currentStep={3} />

                    <div className="mx-auto mt-10 max-w-5xl">
                        <header className="border-b border-deep-blue/10 pb-8">
                            <p className="text-sm font-extrabold tracking-[0.16em] text-instinct-dark uppercase">
                                Previsualización del contrato
                            </p>

                            <h1 className="mt-3 text-4xl leading-[1.03] font-extrabold tracking-[-0.05em] text-deep-blue sm:text-5xl">
                                Revisa y confirma tu contrato
                            </h1>

                            <p className="mt-5 max-w-3xl text-base leading-7 text-deep-blue/65 sm:text-lg">
                                Revisa cuidadosamente la información antes de
                                confirmar. Este documento fue generado
                                automáticamente con los datos ingresados durante
                                la contratación.
                            </p>
                        </header>

                        <div className="mt-8" aria-busy={isBusy}>
                            {isBusy && <GeneratingState />}

                            {status === 'missing' && (
                                <MissingDataState
                                    onBack={() =>
                                        router.visit(checkoutData.url(plan.id))
                                    }
                                />
                            )}

                            {status === 'error' && (
                                <GenerationErrorState
                                    message={errorMessage}
                                    onRetry={() =>
                                        setGenerationAttempt(
                                            (attempt) => attempt + 1,
                                        )
                                    }
                                />
                            )}

                            {status === 'ready' && pdfUrl && (
                                <>
                                    <div className="overflow-hidden border border-deep-blue/10 bg-deep-blue/[0.02] shadow-card">
                                        <div className="flex flex-col gap-3 border-b border-deep-blue/10 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="flex size-9 items-center justify-center rounded-full bg-instinct/10 text-instinct-dark">
                                                    <FileCheck2
                                                        className="size-4"
                                                        strokeWidth={2.2}
                                                        aria-hidden
                                                    />
                                                </span>

                                                <div>
                                                    <p className="text-sm font-extrabold text-deep-blue">
                                                        Documento generado
                                                    </p>
                                                    <p className="text-xs text-deep-blue/55">
                                                        Contrato{' '}
                                                        {contractData?.is_natural_person
                                                            ? 'persona natural'
                                                            : 'persona jurídica'}
                                                    </p>

                                                    {contractData && (
                                                        <p className="mt-1 text-xs leading-5 text-deep-blue/55">
                                                            Generado el{' '}
                                                            {formatContractDate(
                                                                contractData.contract_date,
                                                            )}
                                                            . Vigencia:{' '}
                                                            {formatContractDate(
                                                                contractData.contract_start_date,
                                                            )}{' '}
                                                            al{' '}
                                                            {formatContractDate(
                                                                contractData.contract_end_date,
                                                            )}
                                                            .
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <ButtonLink
                                                href={pdfUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                variant="outline"
                                                className="h-10 justify-center px-4"
                                            >
                                                Abrir contrato
                                                <ExternalLink
                                                    className="size-4"
                                                    aria-hidden
                                                />
                                            </ButtonLink>
                                        </div>

                                        <div className="w-full overflow-hidden bg-[#eef1f5] p-2 sm:p-4">
                                            <iframe
                                                src={`${pdfUrl}#view=FitH`}
                                                title="Previsualización del contrato de Animal Co-work"
                                                className="h-[520px] w-full border-0 bg-white md:h-[760px]"
                                            >
                                                No pudimos mostrar la
                                                previsualización en este
                                                navegador. Utiliza el botón
                                                Abrir contrato.
                                            </iframe>
                                        </div>
                                    </div>

                                    <section className="mt-8 border border-deep-blue/10 bg-deep-blue/[0.025] p-6 sm:p-8">
                                        <h2 className="text-2xl font-extrabold text-deep-blue">
                                            Proceso posterior
                                        </h2>

                                        <p className="mt-3 max-w-4xl text-sm leading-7 text-deep-blue/65 sm:text-base">
                                            La firma electrónica avanzada
                                            corresponde a un proceso posterior e
                                            independiente del flujo de
                                            contratación del sitio web. Una vez
                                            recibido el contrato, un ejecutivo
                                            revisará la información ingresada y
                                            entregará las instrucciones para
                                            completar el proceso de firma
                                            electrónica avanzada.
                                        </p>
                                    </section>

                                    {preparedContract ? (
                                        <ConfirmationState
                                            fileName={
                                                preparedContract.file.name
                                            }
                                        />
                                    ) : (
                                        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-deep-blue/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                disabled={isConfirming}
                                                onClick={() =>
                                                    router.visit(
                                                        checkoutData.url(
                                                            plan.id,
                                                        ),
                                                    )
                                                }
                                                className="h-12 justify-center px-7"
                                            >
                                                Volver y corregir datos
                                            </Button>

                                            <Button
                                                type="button"
                                                disabled={isConfirming}
                                                aria-busy={isConfirming}
                                                onClick={() =>
                                                    void confirmContract()
                                                }
                                                className="h-12 justify-center px-7"
                                            >
                                                {isConfirming
                                                    ? 'Confirmando...'
                                                    : 'Confirmar contrato'}
                                            </Button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </Container>
            </section>
        </PublicLayout>
    );
}

function GeneratingState() {
    return (
        <div
            role="status"
            className="flex min-h-80 flex-col items-center justify-center gap-4 border border-deep-blue/10 bg-deep-blue/[0.025] px-6 text-center"
        >
            <LoaderCircle
                className="size-9 animate-spin text-instinct-dark"
                aria-hidden
            />
            <div>
                <p className="font-extrabold text-deep-blue">
                    Generando contrato...
                </p>
                <p className="mt-2 text-sm text-deep-blue/55">
                    Estamos preparando el documento PDF para su revisión.
                </p>
            </div>
        </div>
    );
}

interface MissingDataStateProps {
    onBack: () => void;
}

function MissingDataState({ onBack }: MissingDataStateProps) {
    return (
        <div
            role="alert"
            className="border border-amber-200 bg-amber-50 px-6 py-8 text-center"
        >
            <h2 className="text-2xl font-extrabold text-deep-blue">
                No encontramos los datos necesarios para generar tu contrato.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-deep-blue/65">
                Vuelve al paso anterior y completa la información requerida.
            </p>
            <Button
                type="button"
                onClick={onBack}
                className="mt-6 justify-center"
            >
                Volver a completar datos
            </Button>
        </div>
    );
}

interface GenerationErrorStateProps {
    message: string | null;
    onRetry: () => void;
}

function GenerationErrorState({ message, onRetry }: GenerationErrorStateProps) {
    return (
        <div
            role="alert"
            className="border border-red-200 bg-red-50 px-6 py-8 text-center"
        >
            <h2 className="text-2xl font-extrabold text-deep-blue">
                No fue posible generar el contrato.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-deep-blue/65">
                {message}
            </p>
            <Button
                type="button"
                onClick={onRetry}
                className="mt-6 justify-center"
            >
                <RotateCcw className="size-4" aria-hidden />
                Intentar nuevamente
            </Button>
        </div>
    );
}

interface ConfirmationStateProps {
    fileName: string;
}

function ConfirmationState({ fileName }: ConfirmationStateProps) {
    return (
        <div
            role="status"
            className="mt-8 border border-instinct/25 bg-instinct/7 px-6 py-7 sm:px-8"
        >
            <div className="flex items-start gap-4">
                <CheckCircle2
                    className="mt-1 size-6 shrink-0 text-instinct-dark"
                    strokeWidth={2.2}
                    aria-hidden
                />
                <div>
                    <h2 className="text-2xl font-extrabold text-deep-blue">
                        Contrato confirmado
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-deep-blue/70 sm:text-base">
                        Tu contrato fue generado correctamente y quedó listo
                        para su procesamiento.
                    </p>
                    <p className="mt-2 text-sm leading-7 text-deep-blue/70 sm:text-base">
                        Una vez aceptado el contrato, un ejecutivo tomará
                        contacto contigo.
                    </p>
                    <p className="mt-4 text-xs leading-5 text-deep-blue/55">
                        Archivo preparado: {fileName}. En la integración final,
                        este documento será enviado automáticamente al correo
                        corporativo destinado a su procesamiento.
                    </p>
                </div>
            </div>
        </div>
    );
}
