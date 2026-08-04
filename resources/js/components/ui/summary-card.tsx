import { Button } from '@/components/ui/button';
import {
    LockKeyhole,
    ShieldCheck,
} from 'lucide-react';

import type {
    CheckoutPlan,
} from '@/types/checkout';

interface SummaryCardProps {
    plan: CheckoutPlan;
    acceptTerms: boolean;
    processing: boolean;
    canContinue: boolean;
    formIsComplete: boolean;
    termsError?: string;
    onTermsChange: (checked: boolean) => void;
}


export function SummaryCard({
    plan,
    acceptTerms,
    processing,
    canContinue,
    formIsComplete,
    termsError,
    onTermsChange,
}: SummaryCardProps) {
    return (
        <aside className="border border-deep-blue/10 bg-white p-6 shadow-[0_18px_45px_rgba(13,27,61,0.08)] sm:p-7">
            <p className="text-xs font-extrabold tracking-[0.16em] text-instinct-dark uppercase">
                Resumen de contratación
            </p>

            <div className="mt-5 flex items-center gap-4 border-b border-deep-blue/10 pb-6">
                <div className="size-20 shrink-0 overflow-hidden rounded-2xl bg-instinct/8">
                    <img
                        src={plan.image}
                        alt={plan.imageAlt}
                        className="h-full w-full object-cover object-center"
                    />
                </div>

                <div className="min-w-0">
                    <h2 className="text-xl font-extrabold tracking-[-0.025em] text-deep-blue">
                        {plan.name}
                    </h2>

                    <p className="mt-1 text-sm leading-5 text-deep-blue/60">
                        {plan.tagline}
                    </p>

                    <span className="mt-2 inline-flex rounded-full bg-instinct/10 px-3 py-1 text-xs font-bold text-instinct-dark">
                        Vigencia: {plan.duration}
                    </span>
                </div>
            </div>

            <div className="py-6">
                <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-deep-blue/60">
                        Valor del plan
                    </span>

                    <span className="text-lg font-extrabold text-deep-blue">
                        {formatCurrencyCLP(plan.price)}
                    </span>
                </div>

                <div className="mt-5 flex items-end justify-between gap-4 border-t border-deep-blue/10 pt-5">
                    <span className="text-base font-extrabold text-deep-blue">
                        Total
                    </span>

                    <span className="text-4xl font-extrabold tracking-[-0.05em] text-instinct">
                        {formatCurrencyCLP(plan.price)}
                    </span>
                </div>
            </div>

            <div className="border-t border-deep-blue/10 pt-6">
                <label className="flex cursor-pointer items-start gap-3">
                    <input
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={(event) =>
                            onTermsChange(event.target.checked)
                        }
                        className="mt-1 size-5 shrink-0 rounded border-deep-blue/25 text-instinct accent-instinct focus:ring-instinct"
                    />

                    <span className="text-sm leading-6 text-deep-blue/70">
                        Declaro que los datos ingresados son correctos y acepto
                        los{' '}
                        <a
                            href="#"
                            className="font-bold text-instinct-dark underline decoration-instinct/40 underline-offset-4"
                        >
                            términos y condiciones
                        </a>
                        .
                    </span>
                </label>

                {termsError && (
                    <p className="mt-3 text-sm font-semibold text-red-600">
                        {termsError}
                    </p>
                )}

                <Button
                    type="submit"
                    form="checkout-form"
                    className="mt-6 h-14 w-full justify-center bg-instinct text-base font-extrabold text-white shadow-[0_12px_28px_rgba(106,174,59,0.28)] hover:-translate-y-0.5 hover:bg-instinct-dark hover:shadow-[0_16px_34px_rgba(106,174,59,0.36)]"
                    disabled={!canContinue}
                >
                    {processing
                        ? 'Procesando...'
                        : 'Continuar con el pago'}
                </Button>

                {!formIsComplete && (
                    <p className="mt-3 text-center text-xs font-semibold text-deep-blue/55">
                        Completa correctamente todos los campos obligatorios para continuar.
                    </p>
                )}

                {formIsComplete && !acceptTerms && (
                    <p className="mt-3 text-center text-xs font-semibold text-deep-blue/55">
                        Debes aceptar los términos y condiciones para continuar.
                    </p>
                )}

                <div className="mt-5 flex items-center justify-center gap-2 text-xs font-semibold text-deep-blue/50">
                    <LockKeyhole
                        className="size-4 text-instinct-dark"
                        strokeWidth={2}
                        aria-hidden
                    />

                    Pago seguro y datos protegidos
                </div>
            </div>

            <div className="mt-6 flex items-start gap-3 bg-deep-blue/4 px-4 py-4">
                <ShieldCheck
                    className="mt-0.5 size-5 shrink-0 text-instinct"
                    strokeWidth={2.2}
                    aria-hidden
                />

                <p className="text-xs leading-5 text-deep-blue/60">
                    Al continuar, tus datos serán utilizados para preparar el
                    contrato correspondiente al plan seleccionado.
                </p>
            </div>
        </aside>
    );
}



function formatCurrencyCLP(value: number) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0,
    }).format(value);
}