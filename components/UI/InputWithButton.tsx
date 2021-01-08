type PropsType = {
    handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
    onClickHandler: Function
    touched?: boolean
    error?: string
    name?: string
    value?: string
    buttonContent: string
    placeholder?: string
}

export function InputWithButton(props: PropsType) {

    const { handleChange,
        onBlur,
        onClickHandler,
        touched, error, value, name, buttonContent, placeholder } = props

    return (
        <div className="input-group">

            <input
                onChange={handleChange}
                onBlur={onBlur}
                value={value}
                name={name}
                placeholder={placeholder}
                className="form-control" >
            </input>

            <div className="input-group-append">
                <button className="btn btn-info" type={'button'} onClick={() => onClickHandler()}>{buttonContent}</button>
            </div>
        </div>)
}

