interface OtherLogoProps {
  className?: string;
}

const OtherLogo = ({ className }: OtherLogoProps) => (
  <img 
    src="/lovable-uploads/4733101a-c39c-4959-9792-331271cd88fe.png" 
    alt="Other Services Logo" 
    className={`${className} bg-transparent mix-blend-multiply`}
    style={{ background: 'transparent' }}
  />
);

export default OtherLogo;