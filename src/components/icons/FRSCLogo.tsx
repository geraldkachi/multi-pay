interface FRSCLogoProps {
  className?: string;
}

const FRSCLogo = ({ className }: FRSCLogoProps) => (
  <img 
    src="/lovable-uploads/04abb72c-6e96-41c0-85d7-4ae927e1ef11.png" 
    alt="Federal Road Safety Commission Logo" 
    className={`${className} bg-transparent mix-blend-multiply`}
    style={{ background: 'transparent' }}
  />
);

export default FRSCLogo;