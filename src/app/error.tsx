'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Next.js Global Error Boundary caught:', error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
            <div className="bg-red-50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-900/50 rounded-2xl p-6 md:p-8 max-w-lg w-full">
                <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">
                    Beklenmeyen Bir Hata Oluştu
                </h2>

                <div className="mb-6 p-4 bg-white dark:bg-black/50 rounded-lg overflow-x-auto text-left border border-red-100 dark:border-red-900/30">
                    <p className="font-mono text-sm text-red-500 font-semibold mb-2">
                        {error.name}: {error.message}
                    </p>
                    {error.digest && (
                        <p className="font-mono text-xs text-gray-500 mt-2">
                            Digest: {error.digest}
                        </p>
                    )}
                    {error.stack && (
                        <pre className="font-mono text-xs text-gray-600 dark:text-gray-400 mt-4 whitespace-pre-wrap">
                            {error.stack}
                        </pre>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        onClick={() => reset()}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        Tekrar Dene
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => window.location.href = '/'}
                    >
                        Ana Sayfaya Dön
                    </Button>
                </div>
            </div>
        </div>
    );
}
