export default function Logo({ className = "" }) {
  return (
    <img 
      src="/logo.png" // Save your logo as public/logo.png
      alt="Guessverse Logo"
      className={`${className} h-12 object-contain`}
    />
  );
}
