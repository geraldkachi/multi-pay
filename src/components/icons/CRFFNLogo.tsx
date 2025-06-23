interface CRFFNLogoProps {
  className?: string;
}

const CRFFNLogo = ({ className }: CRFFNLogoProps) => (
  <img 
    src="/lovable-uploads/53596470-ee2e-4baf-a15a-59b1cab8e252.png" 
    alt="Council for the Regulation of Freight Forwarding in Nigeria Logo" 
    className={`${className} bg-transparent mix-blend-multiply`}
    style={{ background: 'transparent' }}
  />
);

export default CRFFNLogo;