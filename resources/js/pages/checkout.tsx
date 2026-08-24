import { Head, useForm } from '@inertiajs/react';
import type { ComponentProps } from 'react';

import { CheckoutForm } from '@/components/form/checkout-form';
import { CheckoutSteps } from '@/components/ui/checkout-steps';
import { Container } from '@/components/ui/container';
import { NoticeCard } from '@/components/ui/notice-card';
import { SummaryCard } from '@/components/ui/summary-card';
import { PublicLayout } from '@/layouts/public-layout';
import { payment as checkoutPayment } from '@/routes/checkout';

import type { CheckoutFormData, CheckoutFlow } from '@/types/checkout';
import type { Plan } from '@/types/plan';

type FormSubmitHandler = NonNullable<ComponentProps<'form'>['onSubmit']>;

interface CheckoutPageProps {
    plan: Plan;
    flow: CheckoutFlow;
}

export default function Checkout({ plan, flow }: CheckoutPageProps) {
    const { data, setData, post, processing, errors, clearErrors } =
        useForm<CheckoutFormData>({
            plan_id: plan.slug,
            representative_email: '',
            representative_whatsapp: '',
            discount_code: '',
            accept_terms: false,
            accept_data_policy: false,
        });

    /*
     * El botón depende únicamente de que el cliente acepte
     * ambas condiciones y de que no exista un envío en proceso.
     *
     * El correo y WhatsApp serán validados por Laravel
     * al intentar continuar.
     */
    const canContinue =
        data.accept_terms && data.accept_data_policy && !processing;

    const hasErrors = Object.keys(errors).length > 0;

    const submit: FormSubmitHandler = (event) => {
        event.preventDefault();

        post(
            checkoutPayment.url(plan.slug, {
                query: flow === 'renewal' ? { flow } : {},
            }),
            {
                preserveScroll: true,
                preserveState: true,

                onError: () => {
                    requestAnimationFrame(() => {
                        const firstInvalidElement =
                            document.querySelector<HTMLElement>(
                                '[aria-invalid="true"]',
                            );

                        firstInvalidElement?.focus();

                        firstInvalidElement?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center',
                        });
                    });
                },
            },
        );
    };

    function updateContactField(
        key: 'representative_email' | 'representative_whatsapp',
        value: string,
    ) {
        if (key === 'representative_email') {
            setData('representative_email', value);
            clearErrors('representative_email');

            return;
        }

        setData('representative_whatsapp', value);
        clearErrors('representative_whatsapp');
    }

    return (
        <PublicLayout>
            <Head title={`Contratar ${plan.name}`} />

            <section className="bg-white py-8 sm:py-10 lg:py-12">
                <Container>
                    <CheckoutSteps currentStep={1} />

                    <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-14">
                        <div className="min-w-0">
                            <CheckoutHeader plan={plan} />

                            <NoticeCard />

                            {hasErrors && (
                                <div
                                    role="alert"
                                    className="mt-8 border border-red-200 bg-red-50 px-5 py-4"
                                >
                                    <p className="font-extrabold text-red-700">
                                        Revisa los datos ingresados
                                    </p>

                                    <ul className="mt-2 space-y-1">
                                        {Object.entries(errors).map(
                                            ([field, message]) => (
                                                <li
                                                    key={field}
                                                    className="text-sm font-semibold text-red-600"
                                                >
                                                    {message}
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            )}

                            <CheckoutForm
                                data={data}
                                setData={updateContactField}
                                errors={errors}
                                processing={processing}
                                onSubmit={submit}
                            />
                        </div>

                        <div className="lg:sticky lg:top-28">
                            <SummaryCard
                                plan={plan}
                                discountCode={data.discount_code}
                                discountError={errors.discount_code}
                                onDiscountCodeChange={(value) => {
                                    setData('discount_code', value);

                                    clearErrors('discount_code');
                                }}
                                acceptTerms={data.accept_terms}
                                acceptDataPolicy={data.accept_data_policy}
                                processing={processing}
                                canContinue={canContinue}
                                termsError={errors.accept_terms}
                                dataPolicyError={errors.accept_data_policy}
                                onTermsChange={(checked) => {
                                    setData('accept_terms', checked);

                                    clearErrors('accept_terms');
                                }}
                                onDataPolicyChange={(checked) => {
                                    setData('accept_data_policy', checked);

                                    clearErrors('accept_data_policy');
                                }}
                            />
                        </div>
                    </div>
                </Container>
            </section>
        </PublicLayout>
    );
}

interface CheckoutHeaderProps {
    plan: Plan;
}

function CheckoutHeader({ plan }: CheckoutHeaderProps) {
    return (
        <header className="border-b border-deep-blue/10 pb-8">
            <p className="text-sm font-extrabold tracking-[0.16em] text-instinct-dark uppercase">
                Selección del plan y pago
            </p>

            <h1 className="mt-3 max-w-3xl text-4xl leading-[1.03] font-extrabold tracking-[-0.05em] text-deep-blue sm:text-5xl">
                Completa tus datos para continuar
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-deep-blue/65 sm:text-lg">
                Ingresa tu correo electrónico y número de WhatsApp. Luego revisa
                el detalle del{' '}
                <strong className="font-extrabold text-deep-blue">
                    Plan {plan.name}
                </strong>{' '}
                y acepta las condiciones antes de realizar el pago.
            </p>
        </header>
    );
}
