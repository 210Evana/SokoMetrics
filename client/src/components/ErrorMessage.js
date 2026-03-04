function ErrorMessage({ message }) {
  return (
    <div className="error-box">
      ⚠️ {message || 'Something went wrong. Please try again.'}
    </div>
  );
}
export default ErrorMessage;