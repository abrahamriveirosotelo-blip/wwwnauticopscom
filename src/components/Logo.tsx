import nauticopsLogo from "@/assets/nauticops-logo.png";

const Logo = () => {
  return (
    <a href="#" className="flex items-center">
      <img
        src={nauticopsLogo}
        alt="NauticOps"
        className="h-10 w-auto"
      />
    </a>
  );
};

export default Logo;
