export default function Logo({ className = "" }) {
  return (
    <div className={`${className} flex items-center justify-center`}>
      <img src="/logo.png" alt="Guessverse" className="h-10" />
      <div className="bg-primary text-white font-bold rounded-lg p-2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L3 7L12 12L21 7L12 2Z" stroke="currentColor" strokeWidth="2"/>
          <path d="M3 12L12 17L21 12" stroke="currentColor" strokeWidth="2"/>
          <path d="M3 17L12 22L21 17" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </div>
    </div>
  );
}
