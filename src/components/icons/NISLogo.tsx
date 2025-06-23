interface NISLogoProps {
  className?: string;
}

const NISLogo = ({ className }: NISLogoProps) => (
  <img 
    src="/lovable-uploads/71512921-5d60-46f4-a3ce-619722a83e4e.png" 
    alt="Nigeria Immigration Service Logo" 
    className={`${className} bg-transparent mix-blend-multiply`}
    style={{ background: 'transparent' }}
  />
);

export default NISLogo;