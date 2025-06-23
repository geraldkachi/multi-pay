import React from "react";

interface InputProps {
    id: string;
    name: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    type?: string;
    className?: string;
    classLabel?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    value?: string | number | undefined;
    multiline?: boolean; // New prop for multiline support
    error?: string | boolean | undefined;  // To handle error messages
    style?: React.CSSProperties;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
}

const InputField: React.FC<InputProps> = ({
    id,
    name,
    label,
    placeholder = "",
    required = false,
    type = "text",
    className = "",
    classLabel,
    onChange,
    onBlur,
    value,
    multiline = false,
    error,
    style,
    prefix,
    suffix,
}) => {
    return (
        <div className="relative">
            <label
                htmlFor={id}
                className={`block mb-1 text-sm font-medium text-gray-900 ${classLabel}`}
            >
                {label}
            </label>
            <div className="relative">
                {prefix && (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        {prefix}
                    </span>
                )}
                {type === "file" ? (
                    <input
                        type="file"
                        id={id}
                        name={name}
                        required={required}
                        onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
                        onBlur={onBlur as React.FocusEventHandler<HTMLInputElement>}
                        className={`block w-full border border-[#D8DAE5] text-gray-900 text-sm  rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:border-[#A73636]  p-2.5 ${className}`}
                        style={style}
                    />
                ) : multiline ? (
                    <textarea
                        id={id}
                        name={name}
                        placeholder={placeholder}
                        required={required}
                        className={`shadow-sm bg-transparent border border-[#D8DAE5] text-gray-900 text-sm rounded-lg focus:ring-0 outline-none focus:border-[#A73636] block w-full p-2.5 ${className} ${error ? "border-red-500" : ""
                            }`}
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                        style={style}
                    />
                ) : (
                    <input
                        type={type}
                        id={id}
                        name={name}
                        placeholder={placeholder}
                        required={required}
                        className={`shadow-sm bg-transparent border border-[#D8DAE5] text-gray-900 text-sm rounded-lg focus:ring-0 outline-none focus:border-[#A73636] block w-full p-2.5 ${className} ${error ? "border-red-500" : ""
                            }`}
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                    />
                )}
                {suffix && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
                        {suffix}
                    </span>
                )}
            </div>
            {error && typeof error === "string" && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
};

export default InputField;
