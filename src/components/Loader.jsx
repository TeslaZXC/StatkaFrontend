function Loader({ text = "Загрузка..." }) {
  return (
    <div className="flex items-center justify-center h-screen text-brand-light font-sans text-xl">
      {text}
    </div>
  );
}

export default Loader;
