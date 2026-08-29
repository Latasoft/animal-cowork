import { Head, router } from '@inertiajs/react';
import {
    CheckCircle2,
    FileCheck2,
    LoaderCircle,
    RotateCcw,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { CheckoutSteps } from '@/components/ui/checkout-steps';
import { Container } from '@/components/ui/container';
import { PublicLayout } from '@/layouts/public-layout';
import { readContractData } from '@/lib/checkout-storage';
import {
    createAutomaticContractDates,
    formatContractDate,
} from '@/lib/contract-dates';
import {
    blobToBase64,
    createContractConfirmationPayload,
    createContractFileName,
} from '@/lib/contract-file';
import {
    confirm as checkoutConfirm,
    data as checkoutData,
} from '@/routes/checkout';

import type { CheckoutFlow, ContractGenerationData } from '@/types/checkout';
import type { Plan } from '@/types/plan';

type GenerationStatus =
    'loading' | 'generating' | 'ready' | 'missing' | 'error';

interface ContractPreviewPageProps {
    plan: Plan;
    flow: CheckoutFlow;
    confirmation?: boolean;
}

export default function ContractPreview({
    plan,
    flow,
    confirmation = false,
}: ContractPreviewPageProps) {
    if (confirmation) {
        return <ContractConfirmation plan={plan} />;
    }

    return <ContractPreviewFlow plan={plan} flow={flow} />;
}

interface ContractPreviewFlowProps {
    plan: Plan;
    flow: CheckoutFlow;
}

function ContractPreviewFlow({ plan, flow }: ContractPreviewFlowProps) {
    const [status, setStatus] = useState<GenerationStatus>('loading');
    const [generationAttempt, setGenerationAttempt] = useState(0);
    const [contractData, setContractData] =
        useState<ContractGenerationData | null>(null);
    const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isConfirming, setIsConfirming] = useState(false);

    useEffect(() => {
        let isActive = true;

        async function generate(): Promise<void> {
            setStatus('generating');
            setErrorMessage(null);
            setPdfBlob(null);

            const storedContract = readContractData();

            if (!storedContract || storedContract.plan_id !== plan.slug) {
                if (isActive) {
                    setContractData(null);
                    setStatus('missing');
                }

                return;
            }

            try {
                const generationData: ContractGenerationData = {
                    ...storedContract,
                    ...createAutomaticContractDates(
                        plan.contractDurationMonths,
                    ),
                };
                const { generateContractPdf } =
                    await import('@/components/checkout/contracts/contract-pdf');
                const generatedBlob = await generateContractPdf(
                    generationData,
                    plan,
                );

                if (!isActive) {
                    return;
                }

                setContractData(generationData);
                setPdfBlob(generatedBlob);
                setStatus('ready');
            } catch (error) {
                console.error('Contract PDF generation failed.', error);

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
        };
    }, [generationAttempt, plan]);

    async function confirmContract(): Promise<void> {
        if (isConfirming || !pdfBlob || !contractData) {
            return;
        }

        setIsConfirming(true);
        setSubmitError(null);

        try {
            const pdfBase64 = await blobToBase64(pdfBlob);

            const payload = createContractConfirmationPayload(
                contractData,
                pdfBase64,
                createContractFileName(contractData, plan),
            );

            router.post(
                checkoutConfirm.url(plan.slug, {
                    query: flow === 'renewal' ? { flow } : {},
                }),
                payload,
                {
                    preserveScroll: true,
                    onError: (errors) => {
                        const specificMessage = Object.values(
                            errors ?? {},
                        ).find(
                            (message) =>
                                typeof message === 'string' && message.trim(),
                        );

                        setSubmitError(
                            specificMessage ??
                                'No fue posible completar la contratación en este momento. Por favor, inténtalo nuevamente.',
                        );
                    },
                    onFinish: () => setIsConfirming(false),
                },
            );
        } catch (error) {
            console.error('Contract confirmation failed.', error);

            setSubmitError(
                'No fue posible completar la contratación en este momento. Por favor, inténtalo nuevamente.',
            );
            setIsConfirming(false);
        }
    }

    const isBusy = status === 'loading' || status === 'generating';
    const returnUrl = checkoutData.url(plan.slug);

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
                                    onBack={() => router.visit(returnUrl)}
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

                            {status === 'ready' && pdfBlob && (
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

                                            <p className="text-xs font-semibold text-deep-blue/55">
                                                Vista de solo lectura
                                            </p>
                                        </div>

                                        <ContractPdfViewer pdfBlob={pdfBlob} />
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

                                    {submitError && (
                                        <div
                                            role="alert"
                                            className="mt-8 border border-red-200 bg-red-50 px-6 py-5"
                                        >
                                            <p className="font-extrabold text-red-700">
                                                {submitError}
                                            </p>
                                        </div>
                                    )}

                                    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-deep-blue/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            disabled={isConfirming}
                                            onClick={() =>
                                                router.visit(returnUrl)
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
                                </>
                            )}
                        </div>
                    </div>
                </Container>
            </section>
        </PublicLayout>
    );
}

interface ContractConfirmationProps {
    plan: Plan;
}

function ContractConfirmation({ plan }: ContractConfirmationProps) {
    return (
        <PublicLayout>
            <Head title={`Contratación registrada - ${plan.name}`} />

            <section className="bg-white py-8 sm:py-10 lg:py-12">
                <Container>
                    <CheckoutSteps currentStep={3} />

                    <div className="mx-auto mt-10 max-w-3xl">
                        <div
                            role="status"
                            className="border border-instinct/25 bg-instinct/7 px-6 py-10 text-center sm:px-10"
                        >
                            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-instinct/10 text-instinct-dark">
                                <CheckCircle2
                                    className="size-7"
                                    strokeWidth={2.2}
                                    aria-hidden
                                />
                            </span>

                            <h1 className="mt-6 text-3xl font-extrabold tracking-[-0.04em] text-deep-blue sm:text-4xl">
                                ¡Contratación registrada correctamente!
                            </h1>

                            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-deep-blue/70 sm:text-lg">
                                Recibimos tus datos y hemos generado tu
                                documentación. En breve uno de nuestros
                                ejecutivos se pondrá en contacto contigo para
                                continuar con el proceso de firma electrónica.
                            </p>
                        </div>
                    </div>
                </Container>
            </section>
        </PublicLayout>
    );
}

interface ContractPdfViewerProps {
    pdfBlob: Blob;
}

function ContractPdfViewer({ pdfBlob }: ContractPdfViewerProps) {
    const [objectUrl] = useState(() => URL.createObjectURL(pdfBlob));

    useEffect(() => {
        return () => URL.revokeObjectURL(objectUrl);
    }, [objectUrl]);

    const viewerUrl = `${objectUrl}#toolbar=0&navpanes=0&pagemode=none&view=FitH`;

    return (
        <div
            aria-label="Vista PDF de solo lectura del contrato"
            className="h-[75svh] min-h-[32rem] w-full overflow-hidden bg-[#525659] sm:h-[78vh] sm:min-h-[44rem]"
            onContextMenu={(event) => event.preventDefault()}
        >
            <iframe
                src={viewerUrl}
                title="Contrato PDF de solo lectura"
                className="h-full w-full border-0"
                referrerPolicy="no-referrer"
            />
        </div>
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
