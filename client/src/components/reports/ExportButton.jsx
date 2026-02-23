function ExportButton({ onClick, label = 'Export CSV' }) {
  return (
    <button className="rounded bg-slate-900 px-3 py-2 text-white" onClick={onClick}>
      {label}
    </button>
  );
}

export default ExportButton;
