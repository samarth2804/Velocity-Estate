import spinner from "/spinner.gif";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <img src={spinner} alt="loading" />
    </div>
  );
};

export default Loader;
