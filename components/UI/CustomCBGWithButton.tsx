type PropsType = {
  handleChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void
  label?: string
  touched?: boolean
  error?: string
  nameFirst?: string
  nameSecond?: string
  valueFirst?: string
  valueSecond?: string
  itemsFirst?: Array<{ value: string; displayText: string }>
  itemsSecond?: Array<{ value: string; displayText: string }>
  onClickHandler: Function
  buttonContent: string
}

export function CustomCBGwithButton(props: PropsType) {
  const {
    handleChange,
    onBlur,
    label,
    touched,
    error,
    itemsFirst,
    itemsSecond,
    valueFirst,
    valueSecond,
    nameFirst,
    nameSecond,
    onClickHandler,
    buttonContent,
  } = props
  return (
    <div className="input-group">
      {/* <div className="input-group-prepend">
                <span className="input-group-text bg-info text-light">{label}</span>
            </div> */}

      <select
        className="custom-select"
        onChange={handleChange}
        onBlur={onBlur}
        value={valueFirst}
        name={nameFirst}
      >
        <option value="">Select country</option>
        {itemsFirst?.map((i) => {
          return (
            <option value={i.value} key={i.value}>
              {i.displayText}
            </option>
          )
        })}
      </select>

      <select
        className="custom-select"
        onChange={handleChange}
        onBlur={onBlur}
        value={valueSecond}
        name={nameSecond}
      >
        <option value="">Select region</option>
        {itemsSecond?.map((i) => {
          return (
            <option value={i.value} key={i.value}>
              {i.displayText}
            </option>
          )
        })}
      </select>
      <div className="input-group-append">
        <button
          className="btn btn-secondary"
          type="button"
          onClick={() => onClickHandler()}
        >
          {buttonContent}
        </button>
      </div>
    </div>
  )
}
