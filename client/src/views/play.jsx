import Game from '../components/GameComponent'

function Play() {
  return (
    <>
    <div className="flex flex-col bg-gradient-to-r from-green-400 to-blue-500 h-screen">
      <h1 className="self-center w-max mt-10 font-sans text-8xl h-1/4">JOGANDO</h1>
      <div className="self-center border-black border-2 bg-white w-1/2 h-1/2 text-center">

      <Game />

      </div>
    </div>
    </>
  );
}

export default Play;