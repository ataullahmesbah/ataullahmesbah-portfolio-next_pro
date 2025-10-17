// app/components/Share/toastConfig/toastConfig.js
import { toast } from 'react-toastify';

// For React Toastify v10.x - Updated API
export const showSuccessToast = (message) => {
    toast.success(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        style: {
            background: 'linear-gradient(135deg, #6B21A8 0%, #4C1D95 100%)',
            border: '1px solid #8B5CF6',
            borderRadius: '12px',
        },
        bodyStyle: {
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: '500',
        }
    });
};

export const showErrorToast = (message) => {
    toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        style: {
            background: 'linear-gradient(135deg, #7F1D1D 0%, #831843 100%)',
            border: '1px solid #EF4444',
            borderRadius: '12px',
        },
        bodyStyle: {
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: '500',
        }
    });
};

export const showInfoToast = (message) => {
    toast.info(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        style: {
            background: 'linear-gradient(135deg, #1E40AF 0%, #5B21B6 100%)',
            border: '1px solid #3B82F6',
            borderRadius: '12px',
        },
        bodyStyle: {
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: '500',
        }
    });
};