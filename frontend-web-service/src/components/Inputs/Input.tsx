import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';

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

    const isPassword = type === "password";

    return (
        <div className="input-group">
            <label className="input-label">{label}</label>

            <div className="input-wrapper">
                <input
                    type={isPassword ? (showPassword ? "text" : "password") : type}
                    placeholder={placeholder}
                    className="input-control"
                    value={value}
                    onChange={onChange}
                />

                {isPassword && (
                    <div className="input-icon" onClick={toggleShowPassword}>
                        {showPassword ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Input;