import Empty from '../../public/emptyUser.svg'
function EmptyMessage() {
  return (
    <div className="flex flex-col items-center justify-center text-center p-4">
      <img src={Empty} className=" text-gray-400 mb-4" width={250} height={250} loading="lazy"/>
      <h2 className="text-2xl font-semibold text-gray-700">Oops! Nothing to see here...</h2>
      <p className="text-gray-500 mt-2">Break the silence and start chatting with each other</p>
    </div>
  );
}

export default EmptyMessage;
