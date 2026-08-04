import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

import { CheckoutForm } from '@/components/form/checkout-form';
import { CheckoutSteps } from '@/components/ui/checkout-steps';
import { Container } from '@/components/ui/container';
import { NoticeCard } from '@/components/ui/notice-card';
import { SummaryCard } from '@/components/ui/summary-card';
import { PublicLayout } from '@/layouts/public-layout';
import { isCheckoutFormComplete } from '@/lib/checkout-validation';
import type {
    CheckoutFormData,
    CheckoutPlan,
} from '@/types/checkout';

interface CheckoutPageProps {
    plan: CheckoutPlan;
}

export default function Checkout({ plan }: CheckoutPageProps) {
    const {
        data,
        setData,
        post,
        processing,
        errors,
    } = useForm<CheckoutFormData>({
        plan_id: plan.id,
        representative_name: '',
        representative_rut: '',
        company_name: '',
        company_rut: '',
        representative_address: '',
        representative_email: '',
        representative_whatsapp: '',
        accept_terms: false,
    });

    const formIsComplete = isCheckoutFormComplete(data);

    const canContinue =
        formIsComplete &&
        data.accept_terms &&
        !processing;

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!formIsComplete || !data.accept_terms || processing) {
            return;
        }

        post('/checkout', {
            preserveScroll: true,
        });
    }

    return (
        <PublicLayout>
            <Head title={`Contratar ${plan.name}`} />

            <section className="bg-white py-8 sm:py-10 lg:py-12">
                <Container>
                    <CheckoutSteps />

                    <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-14">
                        {/* Contenido principal */}
                        <div className="min-w-0">
                            <CheckoutHeader plan={plan} />

                            <NoticeCard />

                            <CheckoutForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                processing={processing}
                                onSubmit={submit}
                            />
                        </div>

                        {/* Resumen del plan */}
                        <div className="lg:sticky lg:top-28">
                            <SummaryCard
                                plan={plan}
                                acceptTerms={data.accept_terms}
                                processing={processing}
                                canContinue={canContinue}
                                formIsComplete={formIsComplete}
                                termsError={errors.accept_terms}
                                onTermsChange={(checked) =>
                                    setData('accept_terms', checked)
                                }
                            />
                        </div>
                    </div>
                </Container>
            </section>
        </PublicLayout>
    );
}

interface CheckoutHeaderProps {
    plan: CheckoutPlan;
}

function CheckoutHeader({ plan }: CheckoutHeaderProps) {
    return (
        <header className="border-b border-deep-blue/10 pb-8">
            <p className="text-sm font-extrabold tracking-[0.16em] text-instinct-dark uppercase">
                Contratación online
            </p>

            <h1 className="mt-3 max-w-3xl text-4xl leading-[1.03] font-extrabold tracking-[-0.05em] text-deep-blue sm:text-5xl">
                Comienza con tu oficina virtual
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-deep-blue/65 sm:text-lg">
                Completa los datos del representante legal y de la empresa.
                Utilizaremos esta información para preparar el contrato del{' '}
                <strong className="font-extrabold text-deep-blue">
                    {plan.name}
                </strong>
                .
            </p>
        </header>
    );
}