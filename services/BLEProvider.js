// En tu archivo BLEProvider.js

import React, { useState, useMemo, useContext } from 'react';
import useBLE from './useBLE';

const BLEContext = React.createContext(null);

export const BLEProvider = ({ children }) => {
    const bleData = useBLE();
    const [isConcurrencyModeActive, setIsConcurrencyModeActive] = useState(false);
    
    // --- NUEVO: Estado para guardar el destino de la ruta ---
    const [routeDestination, setRouteDestination] = useState(null);

    const toggleConcurrencyMode = () => {
        setIsConcurrencyModeActive(prevState => !prevState);
        console.log(`Modo Concurrencia cambiado a: ${!isConcurrencyModeActive}`);
    };

    // --- NUEVO: Función para limpiar el destino después de usarlo ---
    const clearRouteDestination = () => {
        setRouteDestination(null);
    };

    const memoizedValue = useMemo(() => ({
        ...bleData,
        isConcurrencyModeActive,
        toggleConcurrencyMode,
        // --- NUEVO: Se añaden al contexto ---
        routeDestination,
        setRouteDestination,
        clearRouteDestination,
    }), [bleData, isConcurrencyModeActive, routeDestination]); // <-- Se añade routeDestination a las dependencias

    return (
        <BLEContext.Provider value={memoizedValue}>
            {children}
        </BLEContext.Provider>
    );
};

export const useBLEContext = () => {
    const context = useContext(BLEContext);
    if (context === null) {
        throw new Error("useBLEContext debe ser usado dentro de un BLEProvider");
    }
    return context;
};