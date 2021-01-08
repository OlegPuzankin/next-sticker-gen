
export function Button({ content, onClick, classes, type = 'button' }) {

    const css = `btn ${classes}`
    return (
        <button
            className={css}
            onClick={onClick}
            {...type}
        >{content}
        </button>)
}