type PropsType = {
  inputAttributes: {
    // value?: string
    size: number;
    name: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLSelectElement>) => void;
  };
  label?: string;
  touched?: boolean;
  error?: string;
  id?: string;
  items?: Array<{ value: string; displayText: string }>;
};

export function Select(props: PropsType) {
  const { label, items, error, inputAttributes } = props;
  // const labelStyle = { color: error && 'red', fontWeight: error && 'bold' };

  // function handleMultipleSelect(e) {
  //     //debugger
  //     const result = getSelectValues(multipleSelect.current);
  //     changeHandler(name, result)
  //
  // }
  return (
    <div className="select">
      {label && <label>{label}</label>}
      <select
        className="w-100 p-1"
        {...inputAttributes}
        style={{
          overflowY: "auto",
          border: "1px solid lightgray",
          borderRadius: "3px",
        }}
      >
        {items.map((item) => {
          return (
            <option key={item.value} value={item.value}>
              {item.displayText}
            </option>
          );
        })}
      </select>
    </div>
  );
}
