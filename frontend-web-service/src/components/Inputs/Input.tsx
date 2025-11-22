import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';

// [INSTRUCTION_B] Define interface to enforce type safety for props [INSTRUCTION_E]
interface InputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
    placeholder?: string;
    type?: string;
}

const Input: React.FC<InputProps> = ({ value, onChange, label, placeholder, type = "text" }) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex flex-col gap-1.5 mb-3">
            <label className="text-[13px] font-medium text-slate-800">
                {label}
            </label>

            {/* [INSTRUCTION_B] 
         Replaced original 'input-box' class with Tailwind utilities.
         'focus-within:border-primary' changes border color when input is focused.
         [INSTRUCTION_E] 
      */}
            <div className="flex items-center bg-transparent border-[1.5px] border-slate-200 px-4 py-2 rounded hover:border-slate-300 focus-within:border-blue-500 focus-within:shadow-sm transition-all duration-200">
                <input
                    type={type === "password" ? (showPassword ? "text" : "password") : type}
                    placeholder={placeholder}
                    className="w-full bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-400"
                    value={value}
                    onChange={onChange}
                />

                {type === "password" && (
                    <div className="ml-2 text-slate-500 hover:text-blue-600 transition-colors">
                        {showPassword ? (
                            <FaEye
                                size={18}
                                className="cursor-pointer"
                                onClick={toggleShowPassword}
                            />
                        ) : (
                            <FaEyeSlash
                                size={18}
                                className="cursor-pointer"
                                onClick={toggleShowPassword}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Input;