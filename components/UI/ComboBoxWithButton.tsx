type PropsType = {
    handleChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
    onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void
    onClickHandler: Function
    touched?: boolean
    error?: string
    name?: string
    value?: string
    items?: Array<{ value: string, displayText: string }>
    buttonContent: string
    firstOption: string
}

export function ComboBoxWithButton(props: PropsType) {

    const { handleChange, onBlur, onClickHandler, touched, error, items, value, name, buttonContent, firstOption } = props

    return (
        <div className="input-group mb-2">

            <select
                onChange={handleChange}
                onBlur={onBlur}
                // value={value}
                name={name}
                className="custom-select" >
                <option value={''} className='text-danger'>{firstOption}</option>
                {

                    items?.map(i => {
                        return <option value={i.value} key={i.value}>{i.displayText}</option>
                    })
                }

            </select>

            <div className="input-group-append">
                <button className="btn btn-info" type="button" onClick={() => onClickHandler()}>{buttonContent}</button>
            </div>
        </div>)
}

