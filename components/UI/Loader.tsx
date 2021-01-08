import React from 'react';

export const Loader = () => {
    return (
        <div className="fade-background">
            <div className="spinner-border loader-size-4rem text-secondary" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
};