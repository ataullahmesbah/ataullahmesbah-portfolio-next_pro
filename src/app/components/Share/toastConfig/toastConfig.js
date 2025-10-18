// app/components/Share/toastConfig/toastConfig.js
import { toast } from 'react-toastify';

// For React Toastify v10 - Minimal and compatible version
export const showSuccessToast = (message) => {
    if (typeof window !== 'undefined') {
        toast.success(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
        });
    } else {
        console.log('✅', message);
    }
};

export const showErrorToast = (message) => {
    if (typeof window !== 'undefined') {
        toast.error(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
        });
    } else {
        console.error('❌', message);
    }
};

export const showInfoToast = (message) => {
    if (typeof window !== 'undefined') {
        toast.info(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
        });
    } else {
        console.info('ℹ️', message);
    }
};

export const showWarningToast = (message) => {
    if (typeof window !== 'undefined') {
        toast.warning(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
        });
    } else {
        console.warn('⚠️', message);
    }
};