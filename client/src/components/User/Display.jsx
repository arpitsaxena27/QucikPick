/* eslint-disable react/prop-types */
function Display({ obj }) {
      return (
            <div className="p-2 bg-yellow-400 flex justify-center items-center flex-col gap-2 w-1/3 text-black flex-wrap">
                  <p className="text-3xl">{obj.pro}</p>
                  {obj.img ? (
                        <img
                              src={URL.createObjectURL(obj.img)}
                              alt="Product Image"
                              style={{ width: "100px", height: "100px" }}
                        />
                  ) : (
                        <p>No image selected</p>
                  )}
                  <p>Rs. {obj.price}</p>
                  <p>{obj.quan} in stock</p>
            </div>
      );
}
export default Display;
