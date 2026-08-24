import { LockKeyhole, ShieldCheck, Tag } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { PlanImage } from '@/components/ui/plan-image';
import type { Plan } from '@/types/plan';
import { formatClp } from '@/utils/currency';
import { formatPlanDuration, getPlanTagline } from '@/utils/plans';

interface SummaryCardProps {
    plan: Plan;

    discountCode: string;
    discountError?: string;
    onDiscountCodeChange: (value: string) => void;

    acceptTerms: boolean;
    acceptDataPolicy: boolean;

    processing: boolean;
    canContinue: boolean;

    termsError?: string;
    dataPolicyError?: string;

    onTermsChange: (checked: boolean) => void;
    onDataPolicyChange: (checked: boolean) => void;
}

export function SummaryCard({
    plan,
    discountCode,
    discountError,
    onDiscountCodeChange,
    acceptTerms,
    acceptDataPolicy,
    processing,
    canContinue,
    termsError,
    dataPolicyError,
    onTermsChange,
    onDataPolicyChange,
}: SummaryCardProps) {
    return (
        <aside className="border border-deep-blue/10 bg-white p-6 shadow-[0_18px_45px_rgba(13,27,61,0.08)] sm:p-7">
            <p className="text-xs font-extrabold tracking-[0.16em] text-instinct-dark uppercase">
                Resumen de contratación
            </p>

            {/* Plan seleccionado */}
            <div className="mt-5 flex items-center gap-4 border-b border-deep-blue/10 pb-6">
                <div className="size-20 shrink-0 overflow-hidden rounded-2xl bg-instinct/8">
                    <PlanImage
                        src={plan.image}
                        fallbackImage={plan.fallbackImage}
                        slug={plan.slug}
                        alt={plan.imageAlt}
                        width={80}
                        height={80}
                        className="h-full w-full object-cover object-center"
                    />
                </div>

                <div className="min-w-0">
                    <h2 className="text-xl font-extrabold tracking-[-0.025em] text-deep-blue">
                        Plan {plan.name}
                    </h2>

                    <p className="mt-1 text-sm leading-5 text-deep-blue/60">
                        {getPlanTagline(plan)}
                    </p>

                    <span className="mt-2 inline-flex rounded-full bg-instinct/10 px-3 py-1 text-xs font-bold text-instinct-dark">
                        Vigencia: {formatPlanDuration(plan.contractDurationMonths)}
                    </span>
                </div>
            </div>

            {/* Precio */}
            <div className="py-6">
                <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-deep-blue/60">
                        Valor del plan
                    </span>

                    <span className="text-lg font-extrabold text-deep-blue">
                        {formatClp(plan.totalPrice)}
                    </span>
                </div>

                <div className="mt-5 flex items-end justify-between gap-4 border-t border-deep-blue/10 pt-5">
                    <span className="text-base font-extrabold text-deep-blue">
                        Total
                    </span>

                    <span className="text-4xl font-extrabold tracking-[-0.05em] text-instinct">
                        {formatClp(plan.totalPrice)}
                    </span>
                </div>
            </div>

            {/* Cupón de descuento */}
            <div className="border-t border-deep-blue/10 py-6">
                <label
                    htmlFor="discount_code"
                    className="flex items-center gap-2 text-sm font-extrabold text-deep-blue"
                >
                    <Tag
                        className="size-4 text-instinct"
                        strokeWidth={2.2}
                        aria-hidden
                    />

                    Cupón de descuento
                </label>

                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                    <input
                        id="discount_code"
                        name="discount_code"
                        form="checkout-form"
                        type="text"
                        value={discountCode}
                        onChange={(event) =>
                            onDiscountCodeChange(
                                event.target.value
                                    .toUpperCase()
                                    .replace(/\s/g, ''),
                            )
                        }
                        placeholder="Ingresa tu cupón"
                        autoComplete="off"
                        maxLength={30}
                        disabled={processing}
                        aria-invalid={Boolean(discountError)}
                        aria-describedby={
                            discountError
                                ? 'discount-code-error'
                                : undefined
                        }
                        className={[
                            'h-12 min-w-0 flex-1 rounded-xl border bg-white px-4 text-sm font-bold tracking-[0.05em] text-deep-blue uppercase outline-none transition duration-200',
                            'placeholder:font-medium placeholder:tracking-normal placeholder:text-deep-blue/35 placeholder:normal-case',
                            'hover:border-deep-blue/30 focus:ring-4',
                            'disabled:cursor-not-allowed disabled:bg-deep-blue/3 disabled:opacity-60',
                            discountError
                                ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                                : 'border-deep-blue/15 focus:border-instinct focus:ring-instinct/10',
                        ].join(' ')}
                    />

                    <Button
                        type="button"
                        variant="secondary"
                        disabled={
                            processing ||
                            discountCode.trim().length === 0
                        }
                        className="h-12 shrink-0 justify-center px-5 text-sm"
                    >
                        Aplicar
                    </Button>
                </div>

                {discountError && (
                    <p
                        id="discount-code-error"
                        role="alert"
                        className="mt-2 text-sm font-semibold text-red-600"
                    >
                        {discountError}
                    </p>
                )}
            </div>

            {/* Consentimientos */}
            <div className="space-y-5 border-t border-deep-blue/10 pt-6">
                <div>
                    <label className="flex cursor-pointer items-start gap-3">
                        <input
                            type="checkbox"
                            checked={acceptTerms}
                            onChange={(event) =>
                                onTermsChange(event.target.checked)
                            }
                            disabled={processing}
                            aria-invalid={Boolean(termsError)}
                            aria-describedby={
                                termsError
                                    ? 'accept-terms-error'
                                    : undefined
                            }
                            className="mt-1 size-5 shrink-0 cursor-pointer rounded border-deep-blue/25 accent-instinct focus:ring-instinct disabled:cursor-not-allowed"
                        />

                        <span className="text-sm leading-6 text-deep-blue/70">
                            He leído y acepto los{' '}
                            <a
                                href="/terminos-y-condiciones"
                                target="_blank"
                                rel="noreferrer"
                                className="font-bold text-instinct-dark underline decoration-instinct/40 underline-offset-4"
                            >
                                Términos y Condiciones
                            </a>{' '}
                            del servicio.
                        </span>
                    </label>

                    {termsError && (
                        <p
                            id="accept-terms-error"
                            role="alert"
                            className="mt-2 pl-8 text-sm font-semibold text-red-600"
                        >
                            {termsError}
                        </p>
                    )}
                </div>

                <div>
                    <label className="flex cursor-pointer items-start gap-3">
                        <input
                            type="checkbox"
                            checked={acceptDataPolicy}
                            onChange={(event) =>
                                onDataPolicyChange(event.target.checked)
                            }
                            disabled={processing}
                            aria-invalid={Boolean(dataPolicyError)}
                            aria-describedby={
                                dataPolicyError
                                    ? 'accept-data-policy-error'
                                    : undefined
                            }
                            className="mt-1 size-5 shrink-0 cursor-pointer rounded border-deep-blue/25 accent-instinct focus:ring-instinct disabled:cursor-not-allowed"
                        />

                        <span className="text-sm leading-6 text-deep-blue/70">
                            He leído y acepto la{' '}
                            <a
                                href="/politica-de-privacidad"
                                target="_blank"
                                rel="noreferrer"
                                className="font-bold text-instinct-dark underline decoration-instinct/40 underline-offset-4"
                            >
                                Política de Privacidad
                            </a>{' '}
                            y autorizo el tratamiento de mis datos personales
                            conforme a la Ley N.º 21.719.
                        </span>
                    </label>

                    {dataPolicyError && (
                        <p
                            id="accept-data-policy-error"
                            role="alert"
                            className="mt-2 pl-8 text-sm font-semibold text-red-600"
                        >
                            {dataPolicyError}
                        </p>
                    )}
                </div>
            </div>

            {/* Botón */}
            <Button
                type="submit"
                form="checkout-form"
                className="mt-6 h-14 w-full justify-center bg-instinct text-base font-extrabold text-white shadow-[0_12px_28px_rgba(106,174,59,0.28)] hover:-translate-y-0.5 hover:bg-instinct-dark hover:shadow-[0_16px_34px_rgba(106,174,59,0.36)]"
                disabled={!canContinue || processing}
            >
                {processing ? 'Procesando...' : 'Continuar con el pago'}
            </Button>

            {(!acceptTerms || !acceptDataPolicy) && (
                <p className="mt-3 text-center text-xs leading-5 font-semibold text-deep-blue/55">
                    Debes aceptar los Términos y Condiciones y la Política de
                    Privacidad para habilitar el pago.
                </p>
            )}

            <div className="mt-5 flex items-center justify-center gap-2 text-xs font-semibold text-deep-blue/50">
                <ShieldCheck
                    className="size-4 text-instinct-dark"
                    strokeWidth={2}
                    aria-hidden
                />

                Pago seguro y datos protegidos
            </div>
        </aside>
    );
}
