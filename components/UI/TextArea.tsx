

interface Props {
    handleChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    handleBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void
    error?: string
    placeholder?: string
    name?: string
    value?: string
    label?: string
    rows?: number
    required?: boolean
}

export const TextArea = ({ handleChange, handleBlur, placeholder, value, error, label, rows, name, required }: Props) => {

    return (
        <div className="form-group mb-1">
            {/* <label>{label}</label> */}
            <textarea
                placeholder={placeholder}
                className="form-control"
                name={name}
                value={value}
                onBlur={handleBlur}
                onChange={handleChange}
                required={required}
                rows={rows} />
        </div>
    );
};