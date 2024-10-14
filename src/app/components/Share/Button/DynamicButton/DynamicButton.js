'use client';

// DynamicButton.js
import useDynamicButton from '../UseDynamicButton/UseDynamicButton'; // Ensure this path is correct

const DynamicButton = ({ text = 'Submit', alignment = 'center' }) => {
    const { buttonText, alignment: buttonAlignment } = useDynamicButton(text, alignment);

    // Define alignment classes dynamically based on the input
    const alignmentClasses = buttonAlignment === 'left'
        ? 'justify-start'
        : buttonAlignment === 'right'
            ? 'justify-end'
            : 'justify-center'; // Default center alignment

    return (
        <div className={` flex ${alignmentClasses}`}>
            <div className="grid gap-8 justify-center items-center">
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                    <button
                        type="button"
                        className="relative px-7 py-4 bg-black rounded-lg leading-none flex items-center divide-x divide-gray-600 text-center">
                        <p className="text-indigo-400 group-hover:text-gray-100 transition duration-200">{buttonText}</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DynamicButton;

