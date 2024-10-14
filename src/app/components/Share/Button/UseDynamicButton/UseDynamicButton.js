'use client';

// useDynamicButton.js
import { useState } from 'react';

const useDynamicButton = (initialText = 'Submit', initialAlignment = 'center') => {
    const [buttonText, setButtonText] = useState(initialText);
    const [alignment, setAlignment] = useState(initialAlignment);

    const updateButton = (newText, newAlignment) => {
        setButtonText(newText || buttonText); // Set new text or keep the old one
        setAlignment(newAlignment || alignment); // Set new alignment or keep the old one
    };

    return { buttonText, alignment, updateButton };
};

export default useDynamicButton; // Ensure you're exporting it correctly
