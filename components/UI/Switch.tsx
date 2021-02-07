type PropsType = {
  inputAttributes: {
    name: string
    checked?: boolean
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  }
  label?: string
}

export function Switch(props: PropsType) {
  return (
    <div className="form-check">
      <input
        className="form-check-input big-checkbox"
        type="checkbox"
        name={props.inputAttributes.name}
        onChange={props.inputAttributes.onChange}
        checked={props.inputAttributes.checked}
        id={props.label}
      />
      <label className="form-check-label ml-2" htmlFor={props.label}>
        {props.label}
      </label>
    </div>
  )
}
