export default function Button({ children, onClick, type = "button", variant, disabled }) {
  const style =
    variant === "destructive"
      ? "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
      : "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${style} ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
}