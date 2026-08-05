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
    } = useForm<ContractDataFormData>({
        representative_name: '',
        representative_rut: '',
        company_name: '',
        company_rut: '',
        representative_address: '',
        company_in_progress: false,
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        /*
         * Frontend temporal.
         *
         * Más adelante:
         *
         * Si company_in_progress es true:
         * post('/checkout/data/support')
         *
         * Si company_in_progress es false:
         * post('/checkout/contract-preview')
         */
        console.log('Datos del contrato:', data);
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
                                Completa los datos de tu empresa
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