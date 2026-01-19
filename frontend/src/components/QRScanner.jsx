import React from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';

const QRScanner = ({ onScan, onError, onClose }) => {
    const handleScan = (result) => {
        if (result) {
            const val = result[0]?.rawValue || result?.text || result;
            if (val) onScan(val);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 text-slate-400 hover:text-slate-600 transition-colors bg-white/50 rounded-full p-1"
                >
                    ✕
                </button>

                <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-slate-800">Scan QR Code</h3>
                    <p className="text-sm text-slate-500">Point camera at a code</p>
                </div>

                <div className="overflow-hidden rounded-2xl bg-black border-2 border-slate-100 relative h-64 w-full">
                    <Scanner
                        onScan={handleScan}
                        onError={(err) => {
                            console.error(err);
                            if (onError) onError(err);
                        }}
                        components={{
                            audio: false,
                            torch: false,
                            zoom: false,
                            finder: true
                        }}
                        styles={{
                            container: { height: '100%', width: '100%' },
                            video: { objectFit: 'cover' }
                        }}
                    />
                </div>

                <div className="mt-6 flex justify-center">
                    <button
                        onClick={onClose}
                        className="text-sm font-semibold text-slate-500 hover:text-slate-700"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QRScanner;
