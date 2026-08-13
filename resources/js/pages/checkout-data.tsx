import { Head, router, useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';

import { ContractDataForm } from '@/components/form/contract-data-form';
import { CheckoutSteps } from '@/components/ui/checkout-steps';
import { Container } from '@/components/ui/container';
import { PublicLayout } from '@/layouts/public-layout';
import { readContractData, storeContractData } from '@/lib/checkout-storage';
import { createAutomaticContractDates } from '@/lib/contract-dates';
import {
    contract_preview as contractPreview,
    show as checkoutShow,
} from '@/routes/checkout';

import type {
    ContractDataFormData,
    ContractGenerationData,
    CheckoutFlow,
    CheckoutPlan,
} from '@/types/checkout';

interface CheckoutDataPageProps {
    plan: CheckoutPlan;
    flow: CheckoutFlow;
    customer: {
        email: string;
        whatsapp: string;
    };
}

const emptyContractData: ContractDataFormData = {
    representative_name: '',
    representative_rut: '',
    company_name: '',
    company_rut: '',
    representative_address: '',
    representative_commune: '',
    representative_region: '',
    company_in_progress: false,
    is_natural_person: false,
};

export default function CheckoutData({
    plan,
    flow,
    customer,
}: CheckoutDataPageProps) {
    const { data, setData, errors, setError, clearErrors } =
        useForm<ContractDataFormData>(emptyContractData);
    const [isNavigating, setIsNavigating] = useState(false);
    const [supportRequested, setSupportRequested] = useState(false);
    const restoredPlanId = useRef<string | null>(null);

    useEffect(() => {
        if (restoredPlanId.current === plan.id) {
            return;
        }

        restoredPlanId.current = plan.id;

        const storedData = readContractData();

        if (storedData?.plan_id !== plan.id) {
            return;
        }

        setData({
            representative_name: storedData.representative_name,
            representative_rut: storedData.representative_rut,
            company_name: storedData.company_name,
            company_rut: storedData.company_rut,
            representative_address: storedData.representative_address,
            representative_commune: storedData.representative_commune,
            representative_region: storedData.representative_region,
            company_in_progress:
                flow === 'renewal' ? false : storedData.company_in_progress,
            is_natural_person: storedData.is_natural_person,
        });
    }, [flow, plan.id, setData]);

    function validateForm(): boolean {
        clearErrors();

        let isValid = true;

        const requiredFields: Array<{
            field: keyof ContractDataFormData;
            message: string;
        }> = [
            {
                field: 'representative_name',
                message: 'Debes ingresar el nombre completo.',
            },
            {
                field: 'representative_rut',
                message: data.is_natural_person
                    ? 'Debes ingresar tu RUT personal.'
                    : 'Debes ingresar el RUT del representante legal.',
            },
            {
                field: 'representative_address',
                message: 'Debes ingresar la dirección particular.',
            },
            {
                field: 'representative_commune',
                message: 'Debes ingresar la comuna.',
            },
            {
                field: 'representative_region',
                message: 'Debes ingresar la región.',
            },
        ];

        for (const { field, message } of requiredFields) {
            const value = data[field];

            if (typeof value === 'string' && !value.trim()) {
                setError(field, message);
                isValid = false;
            }
        }

        if (!data.is_natural_person && !data.company_name.trim()) {
            setError(
                'company_name',
                'Debes ingresar la razón social o nombre de la empresa.',
            );
            isValid = false;
        }

        if (
            !data.is_natural_person &&
            !data.company_in_progress &&
            !data.company_rut.trim()
        ) {
            setError('company_rut', 'Debes ingresar el RUT de la empresa.');
            isValid = false;
        }

        return isValid;
    }

    function focusFirstError(): void {
        requestAnimationFrame(() => {
            const firstInvalidElement = document.querySelector<HTMLElement>(
                '[aria-invalid="true"]',
            );

            firstInvalidElement?.focus();
            firstInvalidElement?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        });
    }

    function submit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        setSupportRequested(false);

        if (!validateForm()) {
            focusFirstError();

            return;
        }

        if (data.company_in_progress && !data.is_natural_person) {
            setSupportRequested(true);

            return;
        }

        const contractData: ContractGenerationData = {
            ...data,
            company_in_progress:
                flow === 'renewal' ? false : data.company_in_progress,
            ...createAutomaticContractDates(plan.contractDurationMonths),
            plan_id: plan.id,
            representative_email: customer.email,
            representative_whatsapp: customer.whatsapp,
            company_name: data.is_natural_person ? '' : data.company_name,
            company_rut: data.is_natural_person
                ? data.representative_rut
                : data.company_rut,
        };

        storeContractData(contractData);

        router.visit(contractPreview.url(plan.id), {
            onStart: () => setIsNavigating(true),
            onFinish: () => setIsNavigating(false),
        });
    }

    return (
        <PublicLayout>
            <Head title={`Datos del contrato - ${plan.name}`} />

            <section className="bg-white py-8 sm:py-10 lg:py-12">
                <Container>
                    <CheckoutSteps currentStep={2} />

                    <div className="mx-auto mt-10 max-w-4xl">
                        <header className="border-b border-deep-blue/10 pb-8">
                            <p className="text-sm font-extrabold tracking-[0.16em] text-instinct-dark uppercase">
                                Pago confirmado
                            </p>

                            <h1 className="mt-3 text-4xl leading-[1.03] font-extrabold tracking-[-0.05em] text-deep-blue sm:text-5xl">
                                Completa los datos del contrato
                            </h1>

                            <p className="mt-5 max-w-3xl text-base leading-7 text-deep-blue/65 sm:text-lg">
                                Utilizaremos esta información para elaborar el
                                contrato correspondiente al plan{' '}
                                <strong className="font-extrabold text-deep-blue">
                                    {plan.name}
                                </strong>
                                .
                            </p>
                        </header>

                        {supportRequested && (
                            <div
                                role="status"
                                className="mt-8 border-l-4 border-instinct bg-instinct/7 px-5 py-5 text-sm leading-6 text-deep-blue/70"
                            >
                                Tus antecedentes quedaron preparados para la
                                revisión de un ejecutivo. Este flujo no genera
                                un contrato convencional mientras la empresa no
                                tenga RUT.
                            </div>
                        )}

                        <ContractDataForm
                            data={data}
                            setData={setData}
                            errors={errors}
                            processing={isNavigating}
                            showCompanyInProgress={flow !== 'renewal'}
                            onSubmit={submit}
                            onBack={() =>
                                router.visit(
                                    checkoutShow.url(plan.id, {
                                        query:
                                            flow === 'renewal' ? { flow } : {},
                                    }),
                                )
                            }
                        />
                    </div>
                </Container>
            </section>
        </PublicLayout>
    );
}
