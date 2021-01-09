import cn from 'classnames'

interface Props {
    inputAttributes: {
        onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
        onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
        name: string,
        type: string,
        value: string,
        placeholder?: string
        min?: number
        max?: number
    }

    labelWidth?: number
    label: string
    error?: string
    labelStyle?: string
}




export const InlineInput = (props: Props) => {
    const {
        label,
        error,
        labelWidth,
        inputAttributes,
        labelStyle = '',
    } = props;
    const lw = labelWidth ? `${labelWidth}px` : 'auto'



    return (
        <>
            <div className={`input-group`}>
                <div className='input-group-prepend' >
                    <span
                        className={cn('input-group-text', labelStyle, { 'text-danger font-weight-bold': error })}
                        style={{ width: lw }}>
                        {label}
                    </span>
                </div>
                <input className="form-control "
                    {...inputAttributes} />

            </div>
            {/*{error && <p className='text-danger text-left'>{error}</p>}*/}
        </>

    );
};