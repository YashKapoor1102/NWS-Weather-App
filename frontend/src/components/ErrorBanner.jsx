/**
 * Displays an error message if one exists
 * 
 * @param {Object} props
 * @param {string} props.message    - Error message to display 
 * @returns {import("react").ReactElement | null}       - Error message, or null if unavailable
 */
export function ErrorBanner({ message }) {
    if (!message) {
        return null;
    }

    return (
        <div className="error">
            <strong>Error:</strong> {message}
        </div>
    );
}
