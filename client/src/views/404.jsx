const r404 = () => {
  return (
    <div className="container flex flex-col bg-gray-500 my-56 mx-auto border-4">
      <h1 className="text-red-600 text-9xl text-center font-extrabold">404</h1>
      <p className="text-center my-9">Está página não existe</p>
      <a href="/" className="text-center box-border bg-blue-200">Voltar ao início</a>
    </div>
  );
};

export default r404;