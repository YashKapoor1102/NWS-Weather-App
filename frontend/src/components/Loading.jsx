/**
 * Displays a loading spinner
 * 
 * @param {Object} props
 * @param {string} [props.text="Loading..."]    - Loading message 
 * @returns {import("react").ReactElement}
 */
export function Loading({ text = "Loading..." }) {
    return (
        <div className="loading">
            <div className="spinner" aria-hidden="true" />
            <div>{text}</div>
        </div> 
    );
}
