

interface Props {
    handleChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    handleBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void
    error?: string
    placeholder?: string
    name?: string
    value?: string
    label?: string
    rows?: number
}

export const TextArea = ({ handleChange, handleBlur, placeholder, value, error, label, rows, name }: Props) => {

    return (
        <div className="form-group">
            {/* <label>{label}</label> */}
            <textarea
                placeholder={placeholder}
                className="form-control"
                name={name}
                value={value}
                onBlur={handleBlur}
                onChange={handleChange}
                rows={rows} />
        </div>
    );
};