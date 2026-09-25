import type { PropsWithChildren } from 'react';
import { Header } from '@/components/layout/header';

export function PublicLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen overflow-x-clip bg-background text-deep-blue">
            <Header />

            <main>{children}</main>
        </div>
    );
}
