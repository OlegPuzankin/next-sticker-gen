import cn from 'classnames'

type PropsType = {
    handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    onBlur: (e: React.FocusEvent<HTMLSelectElement>) => void
    label: string
    error?: string
    id?: string
    name: string
    value: string
    items: Array<{ value: string, displayText: string }>
    firstOption: string
    labelWidth?: number
    labelStyle?: string

}

export function InlineComboBox(props: PropsType) {

    const {

        handleChange,
        onBlur,
        label,
        error,
        id,
        items,
        value,
        name,
        firstOption,
        labelWidth,
        labelStyle = '',
    } = props

    const lw = labelWidth ? `${labelWidth}px` : 'auto'
    return (
        <div className={`input-group`}>

            <div className="input-group-prepend">
                <label
                    className={cn('input-group-text', labelStyle, { 'text-danger font-weight-bold': error })}
                    htmlFor={id}
                    style={{ width: lw }}>{label}</label>
            </div>
            <select
                className="custom-select"
                onChange={handleChange}
                onBlur={onBlur}
                value={value}
                name={name}
                id={id}>
                <option value=''>{firstOption}</option>
                {
                    items.map(i => {
                        return <option value={i.value} key={i.value}>{i.displayText}</option>
                    })
                }
            </select>
        </div>

    )
}

