const LoadingButton = ({ children, icon: Icon, isLoading, ...props }) => {
  return (
    <button {...props} disabled={isLoading || props.disabled}>
      {Icon ? <Icon size={18} aria-hidden="true" /> : null}
      <span>{isLoading ? "Please wait..." : children}</span>
    </button>
  );
};

export default LoadingButton;
