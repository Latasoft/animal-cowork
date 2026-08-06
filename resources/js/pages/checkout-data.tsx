import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

import { ContractDataForm } from '@/components/form/contract-data-form';
import { CheckoutSteps } from '@/components/ui/checkout-steps';
import { Container } from '@/components/ui/container';
import { PublicLayout } from '@/layouts/public-layout';

import type {
    ContractDataFormData,
    CheckoutPlan,
} from '@/types/checkout';

interface CheckoutDataPageProps {
    plan: CheckoutPlan;
}

export default function CheckoutData({
    plan,
}: CheckoutDataPageProps) {
    const {
        data,
        setData,
        processing,
        errors,
        setError,
        clearErrors,
    } = useForm<ContractDataFormData>({
        representative_name: '',
        representative_rut: '',
        company_name: '',
        company_rut: '',
        representative_address: '',
        company_in_progress: false,
        is_natural_person: false,
    });

    function validateForm(): boolean {
        clearErrors();

        let isValid = true;

        if (!data.representative_name.trim()) {
            setError(
                'representative_name',
                'Debes ingresar el nombre completo.',
            );

            isValid = false;
        }

        if (!data.representative_rut.trim()) {
            setError(
                'representative_rut',
                data.is_natural_person
                    ? 'Debes ingresar tu RUT personal.'
                    : 'Debes ingresar el RUT del representante legal.',
            );

            isValid = false;
        }

        if (!data.representative_address.trim()) {
            setError(
                'representative_address',
                'Debes ingresar la dirección particular.',
            );

            isValid = false;
        }

        if (!data.company_name.trim()) {
            setError(
                'company_name',
                data.is_natural_person
                    ? 'Debes ingresar el nombre para el contrato.'
                    : 'Debes ingresar la razón social o nombre de la empresa.',
            );

            isValid = false;
        }

        /*
         * El RUT de empresa solamente es obligatorio cuando:
         *
         * - No es una persona natural.
         * - La empresa no está en proceso de constitución.
         */
        if (
            !data.is_natural_person &&
            !data.company_in_progress &&
            !data.company_rut.trim()
        ) {
            setError(
                'company_rut',
                'Debes ingresar el RUT de la empresa.',
            );

            isValid = false;
        }

        return isValid;
    }

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const isValid = validateForm();

        if (!isValid) {
            return;
        }

        if (data.company_in_progress) {
            console.log(
                'Información de empresa en constitución:',
                data,
            );

            /*
             * Más adelante:
             *
             * post('/checkout/data/support')
             */
            return;
        }

        if (data.is_natural_person) {
            console.log(
                'Contrato para persona natural:',
                data,
            );

            /*
             * Más adelante:
             *
             * post('/checkout/contract-preview/natural-person')
             */
            return;
        }

        console.log(
            'Contrato para persona jurídica:',
            data,
        );

        /*
         * Más adelante:
         *
         * post('/checkout/contract-preview/legal-entity')
         */
    }

    return (
        <PublicLayout>
            <Head
                title={`Datos del contrato - ${plan.name}`}
            />

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
                                Utilizaremos esta información
                                para elaborar el contrato
                                correspondiente al plan{' '}
                                <strong className="font-extrabold text-deep-blue">
                                    {plan.name}
                                </strong>
                                .
                            </p>
                        </header>

                        <ContractDataForm
                            data={data}
                            setData={setData}
                            errors={errors}
                            processing={processing}
                            onSubmit={submit}
                        />
                    </div>
                </Container>
            </section>
        </PublicLayout>
    );
}