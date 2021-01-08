
type PropsType = {
    handleChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
    onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void
    label?: string
    touched?: boolean
    error?: string
    id?: string
    name?: string
    value?: string
    items?: Array<{ value: string, displayText: string }>
}

export function ComboBox(props: PropsType) {

    const { handleChange, onBlur, label, touched, error, id, items, value, name } = props

    return (
        <div className="form-group">
            <label htmlFor={id}>{label}</label>
            <select
                className="form-control"
                onChange={handleChange}
                onBlur={onBlur}
                value={value}
                name={name}
                id={id}>
                <option value='select'>Select item</option>
                {

                    items?.map(i => {
                        return <option value={i.value} key={i.value}>{i.displayText}</option>
                    })
                }


            </select>
        </div>)
}