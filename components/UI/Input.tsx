interface Props {
    handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
    error?: string
    type?: string
    id?: string
    placeholder?: string
    name?: string
    value?: string
    required?: boolean
}

export function Input(props: Props) {
    let { handleChange, onBlur, error, type = 'text', id, placeholder, name, value, required = false } = props
    return (

        <input
            onChange={handleChange}
            onBlur={onBlur}
            name={name}
            value={value}
            type={type}
            id={id}
            className="form-control"
            placeholder={placeholder}
            required={required} />
    )

}