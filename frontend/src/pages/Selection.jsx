import React from 'react';
import Countdown from '../components/shared/ui/Countdown/Countdown';

const Selection = () => {
    // Exemple de date cible : 31 décembre 2026 à minuit
    const targetDate = new Date('2026-12-31T23:59:59');

    return (
        <div className="selection-page">
            <div className="flex flex-col items-center justify-center h-screen px-4">
                <p className="text-center text-lg md:text-2xl text-slate-100/90 font-semibold tracking-wide mb-6 max-w-2xl">
                    Le résultat de la sélection sera publié très bientôt.
                </p>
                <Countdown targetDate={targetDate} className="selection-countdown" />
            </div>
        </div>
    );
};

export default Selection;