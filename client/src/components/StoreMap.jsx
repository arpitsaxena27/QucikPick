import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchShelfInfo, selectShelves } from "../store/slices/productsSlice";
import storeimg from "../assets/images/arpit_ka_map.png";

const StoreMap = ({ updateCount1 }) => {
      const dispatch = useDispatch();
      const shelves = useSelector(selectShelves);
      console.log(shelves);

      useEffect(() => {
            dispatch(fetchShelfInfo());
      }, [dispatch]);

      const getShelfName = (nid) => {
            const shelf = shelves.find((s) => s.nid === nid);
            return shelf ? shelf.name : "Unknown";
      };

      const toggleCategory = (category) => {
            updateCount1((prevCategory) =>
                  prevCategory === category ? "" : category
            );
            const lineIds = [
                  "e1-3",
                  "e3-2",
                  "e2-4",
                  "e3-5",
                  "e5-6",
                  "e5-39",
                  "e39-7",
                  "e7-8",
                  "e1-20",
                  "e20-9",
                  "e9-10",
                  "e9-11",
                  "e9-40",
                  "e40-12",
                  "e12-13",
                  "e12-14",
                  "e12-15",
                  "e15-16",
                  "e16-17",
                  "e15-18",
                  "e18-19",
                  "e20-21",
                  "e21-22",
                  "e22-23",
                  "e21-24",
                  "e24-25",
                  "e25-26",
                  "e24-41",
                  "e41-27",
                  "e27-28",
                  "e28-29",
                  "e28-30",
                  "e30-32",
                  "e32-31",
                  "e30-33",
                  "e33-34",
                  "e33-38",
                  "e38-35",
                  "e35-36",
                  "e22-37",
                  "e37-35",
                  "e25-38",
                  "e39-16",
                  "e18-27",
                  "e40-41",
                  "e28-42",
            ];
            lineIds.forEach((id) => {
                  const line = document.getElementById(id);
                  if (line) {
                        line.style.opacity = "0";
                  }
            });

            // Reset opacity for nodes
            const nodeIds = [
                  "n1",
                  "n2",
                  "n3",
                  "n4",
                  "n5",
                  "n6",
                  "n7",
                  "n8",
                  "n9",
                  "n10",
                  "n11",
                  "n12",
                  "n13",
                  "n14",
                  "n15",
                  "n16",
                  "n17",
                  "n18",
                  "n19",
                  "n20",
                  "n21",
                  "n22",
                  "n23",
                  "n24",
                  "n25",
                  "n26",
                  "n27",
                  "n28",
                  "n29",
                  "n30",
                  "n31",
                  "n32",
                  "n33",
                  "n34",
                  "n35",
                  "n36",
                  "n37",
                  "n38",
                  "n39",
                  "n40",
                  "n41",
                  "n42",
            ];
            nodeIds.forEach((id) => {
                  const node = document.getElementById(id);
                  if (node) {
                        node.style.opacity = "0";
                  }
            });
      };

      return (
            <div
                  id="main"
                  className=" top-3 absolute z-50 w-[1145px] h-[850px] "
            >
                  <svg className="absolute top-14 left-8 min-h-max min-w-max w-[1150px] h-[840px] z-30">
                        <line
                              opacity={0}
                              id="e1-3"
                              x1="29.5%"
                              y1="71.5%"
                              x2="14.4%"
                              y2="71.5%"
                              stroke="green"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e3-2"
                              x1="15%"
                              y1="71.5%"
                              x2="9.5%"
                              y2="71.5%"
                              stroke="green"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e2-4"
                              x1="9.5%"
                              y1="71.7%"
                              x2="9.5%"
                              y2="67%"
                              stroke="green"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e3-5"
                              x1="14.5%"
                              y1="71.6%"
                              x2="14.5%"
                              y2="41.3%"
                              stroke="green"
                              data-weight="4.5"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e5-6"
                              x1="14.5%"
                              y1="41.5%"
                              x2="12%"
                              y2="41.5%"
                              stroke="green"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e5-39"
                              x1="14.5%"
                              y1="42%"
                              x2="14.5%"
                              y2="35.3%"
                              stroke="green"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e39-7"
                              x1="14.5%"
                              y1="35.3%"
                              x2="14.5%"
                              y2="23.3%"
                              stroke="green"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e7-8"
                              x1="14.6%"
                              y1="23.5%"
                              x2="12%"
                              y2="23.5%"
                              stroke="green"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e1-20"
                              x1="29.5%"
                              y1="72%"
                              x2="29.5%"
                              y2="62%"
                              stroke="green"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e20-9"
                              x1="29.5%"
                              y1="62%"
                              x2="29.5%"
                              y2="56.3%"
                              stroke="green"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e9-10"
                              x1="29.5%"
                              y1="56.5%"
                              x2="26%"
                              y2="56.5%"
                              stroke="green"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e9-11"
                              x1="29.5%"
                              y1="56.5%"
                              x2="33%"
                              y2="56.5%"
                              stroke="green"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e9-40"
                              x1="29.5%"
                              y1="56.5%"
                              x2="29.5%"
                              y2="51.2%"
                              stroke="green"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e40-12"
                              x1="29.5%"
                              y1="51.2%"
                              x2="29.5%"
                              y2="41.5%"
                              stroke="green"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e12-13"
                              x1="29.7%"
                              y1="41.5%"
                              x2="26%"
                              y2="41.5%"
                              stroke="green"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e12-14"
                              x1="29.3%"
                              y1="41.5%"
                              x2="33%"
                              y2="41.5%"
                              stroke="green"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e12-15"
                              x1="29.5%"
                              y1="41.5%"
                              x2="29.5%"
                              y2="35.3%"
                              stroke="green"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e15-16"
                              x1="29.5%"
                              y1="35.5%"
                              x2="21.3%"
                              y2="35.5%"
                              stroke="green"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e16-17"
                              x1="21.5%"
                              y1="35.5%"
                              x2="21.5%"
                              y2="32%"
                              stroke="green"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e15-18"
                              x1="29.5%"
                              y1="35.5%"
                              x2="40.5%"
                              y2="35.5%"
                              stroke="green"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e18-19"
                              x1="40.5%"
                              y1="35.7%"
                              x2="40.5%"
                              y2="32%"
                              stroke="green"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e20-21"
                              x1="29.5%"
                              y1="62.3%"
                              x2="46.7%"
                              y2="62.5%"
                              stroke="green"
                              strokeWidth="5"
                        />

                        <line
                              opacity={0}
                              id="e22-37"
                              x1="65.5%"
                              y1="62.6%"
                              x2="81.8%"
                              y2="62.6%"
                              stroke="green"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e37-35"
                              x1="81.6%"
                              y1="62.6%"
                              x2="81.6%"
                              y2="60.3%"
                              stroke="green"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e25-38"
                              x1="65.5%"
                              y1="54.5%"
                              x2="81.8%"
                              y2="54.5%"
                              stroke="green"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e39-16"
                              x1="14.5%"
                              y1="35.5%"
                              x2="21.3%"
                              y2="35.5%"
                              stroke="green"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e18-27"
                              x1="40.5%"
                              y1="35.5%"
                              x2="46.5%"
                              y2="35.5%"
                              stroke="green"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e40-41"
                              x1="29.5%"
                              y1="51.5%"
                              x2="46.6%"
                              y2="51.5%"
                              stroke="green"
                              strokeWidth="5"
                        />

                        <line
                              opacity={0}
                              id="e21-22"
                              x1="46.5%"
                              y1="62.5%"
                              x2="65.6%"
                              y2="62.5%"
                              stroke="green"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e22-23"
                              x1="65.5%"
                              y1="62.6%"
                              x2="65.5%"
                              y2="60%"
                              stroke="green"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e21-24"
                              x1="46.5%"
                              y1="62.5%"
                              x2="46.5%"
                              y2="54.4%"
                              stroke="green"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e24-25"
                              x1="46.3%"
                              y1="54.4%"
                              x2="65.7%"
                              y2="54.5%"
                              stroke="green"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e25-26"
                              x1="65.5%"
                              y1="54.5%"
                              x2="65.5%"
                              y2="52.5%"
                              stroke="green"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e24-41"
                              x1="46.5%"
                              y1="55%"
                              x2="46.5%"
                              y2="51%"
                              stroke="green"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e41-27"
                              x1="46.5%"
                              y1="52%"
                              x2="46.5%"
                              y2="35.3%"
                              stroke="green"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e27-28"
                              x1="46.5%"
                              y1="35.5%"
                              x2="65.5%"
                              y2="35.5%"
                              stroke="green"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e28-29"
                              x1="65.5%"
                              y1="35.7%"
                              x2="65.5%"
                              y2="33%"
                              stroke="green"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e28-30"
                              x1="65.5%"
                              y1="35.5%"
                              x2="82%"
                              y2="35.5%"
                              stroke="green"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e30-32"
                              x1="81.8%"
                              y1="35.5%"
                              x2="81.8%"
                              y2="25.3%"
                              stroke="green"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e32-31"
                              x1="81.8%"
                              y1="25.5%"
                              x2="82.8%"
                              y2="25.5%"
                              stroke="green"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e30-33"
                              x1="81.8%"
                              y1="35.5%"
                              x2="81.8%"
                              y2="45.7%"
                              stroke="green"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e33-34"
                              x1="81.8%"
                              y1="45.5%"
                              x2="83%"
                              y2="45.5%"
                              stroke="green"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e33-38"
                              x1="81.8%"
                              y1="45.5%"
                              x2="81.8%"
                              y2="54.7%"
                              stroke="green"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e38-35"
                              x1="81.8%"
                              y1="54.7%"
                              x2="81.8%"
                              y2="60.5%"
                              stroke="green"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e35-36"
                              x1="81.6%"
                              y1="60.5%"
                              x2="83%"
                              y2="60.5%"
                              stroke="green"
                              strokeWidth="5"
                        />
                        <line
                              opacity={0}
                              id="e28-42"
                              x1="65.3%"
                              y1="35.3%"
                              x2="65.3%"
                              y2="36.5%"
                              stroke="green"
                              strokeWidth="5"
                        />
                  </svg>

                  <div
                        id="n1"
                        className="bg-red-500 opacity-0 w-5 h-5 z-50 rounded-full absolute top-[76%] left-[31.5%]"
                  ></div>
                  <div
                        id="n2"
                        className="bg-green-700 opacity-0 w-4 h-4 z-50 rounded-full absolute top-[76%] left-[11.5%]"
                  ></div>
                  <div
                        id="n3"
                        className="bg-green-700 opacity-0 w-4 h-4 z-50 rounded-full absolute top-[76%] left-[16.5%]"
                  ></div>
                  <div
                        id="n4"
                        className="bg-green-700 opacity-0 w-4 h-4 z-50 rounded-full absolute top-[71%] left-[11.5%]"
                  ></div>
                  <div
                        id="n5"
                        className="bg-green-700 opacity-0 w-4 h-4 z-50 rounded-full absolute top-[46%] left-[16.5%]"
                  ></div>
                  <div
                        id="n6"
                        className="bg-green-700 opacity-0 w-4 h-4 z-50 rounded-full absolute top-[46%] left-[14.5%]"
                  ></div>
                  <div
                        id="n7"
                        className="bg-green-700 opacity-0 w-4 h-4 z-50 rounded-full absolute top-[28%] left-[16.5%]"
                  ></div>
                  <div
                        id="n8"
                        className="bg-green-700 opacity-0 w-4 h-4 z-50 rounded-full absolute top-[28%] left-[14.5%]"
                  ></div>
                  <div
                        id="n9"
                        className="bg-green-700 opacity-0 w-4 h-4 z-50 rounded-full absolute top-[61%] left-[31.5%]"
                  ></div>
                  <div
                        id="n10"
                        className="bg-green-700 opacity-0 w-4 h-4 z-50 rounded-full absolute top-[61%] left-[28.5%]"
                  ></div>
                  <div
                        id="n11"
                        className="bg-green-700 opacity-0 w-4 h-4 z-50 rounded-full absolute top-[61%] left-[34.5%]"
                  ></div>
                  <div
                        id="n12"
                        className="bg-green-700 opacity-0 w-4 h-4 z-50 rounded-full absolute top-[46%] left-[31.5%]"
                  ></div>
                  <div
                        id="n13"
                        className="bg-green-700 opacity-0 w-4 h-4 z-50 rounded-full absolute top-[46%] left-[28.5%]"
                  ></div>
                  <div
                        id="n14"
                        className="bg-green-700 opacity-0 w-4 h-4 z-50 rounded-full absolute top-[46%] left-[34.5%]"
                  ></div>
                  <div
                        id="n15"
                        className="bg-green-700 opacity-0 w-4 h-4 z-50 rounded-full absolute top-[40%] left-[31.5%]"
                  ></div>
                  <div
                        id="n16"
                        className="bg-green-700 opacity-0 w-4 h-4 z-50 rounded-full absolute top-[40%] left-[23.5%]"
                  ></div>
                  <div
                        id="n17"
                        className="bg-green-700 opacity-0 w-4 h-4 z-50 rounded-full absolute top-[37%] left-[23.5%]"
                  ></div>
                  <div
                        id="n18"
                        className="bg-green-700 opacity-0 w-4 h-4 z-50 rounded-full absolute top-[40%] left-[42.5%]"
                  ></div>
                  <div
                        id="n19"
                        className="bg-green-700 opacity-0 w-4 h-4 z-50 rounded-full absolute top-[37%] left-[42.5%]"
                  ></div>
                  <div
                        id="n20"
                        className="bg-green-700 opacity-0 w-4 h-4 z-50 rounded-full absolute top-[67%] left-[31.5%]"
                  ></div>
                  <div
                        id="n21"
                        className="bg-green-700 opacity-0 w-4 h-4 z-50 rounded-full absolute top-[67%] left-[48.5%]"
                  ></div>
                  <div
                        id="n22"
                        className="bg-green-700 opacity-0 w-4 h-4 z-50 rounded-full absolute top-[67%] left-[67.5%]"
                  ></div>
                  <div
                        id="n23"
                        className="bg-green-700 opacity-0 w-4 h-4 z-50 rounded-full absolute top-[65%] left-[67.5%]"
                  ></div>
                  <div
                        id="n24"
                        className="bg-green-700 opacity-0 w-4 h-4 z-50 rounded-full absolute top-[59%] left-[48.5%]"
                  ></div>
                  <div
                        id="n25"
                        className="bg-green-700 opacity-0 w-4 h-4 z-50 rounded-full absolute top-[59%] left-[67.5%]"
                  ></div>
                  <div
                        id="n26"
                        className="bg-green-700 opacity-0 w-4 h-4 z-50 rounded-full absolute top-[57%] left-[67.5%]"
                  ></div>
                  <div
                        id="n27"
                        className="bg-green-700 opacity-0 w-4 h-4 z-50 rounded-full absolute top-[40%] left-[48.5%]"
                  ></div>
                  <div
                        id="n28"
                        className="bg-green-700 opacity-0 w-4 h-4 z-50 rounded-full absolute top-[40%] left-[67.5%]"
                  ></div>
                  <div
                        id="n29"
                        className="bg-green-700 opacity-0 w-4 h-4 z-50 rounded-full absolute top-[37.4%] left-[67.8%]"
                  ></div>
                  <div
                        id="n30"
                        className="bg-green-700 opacity-0 w-4 h-4 z-50 rounded-full absolute top-[40%] left-[84%]"
                  ></div>
                  <div
                        id="n31"
                        className="bg-green-700 opacity-0 w-4 h-4 z-50 rounded-full absolute top-[30%] left-[85.5%]"
                  ></div>
                  <div
                        id="n32"
                        className="bg-green-700 opacity-0 w-4 h-4 z-50 rounded-full absolute top-[30%] left-[84%]"
                  ></div>
                  <div
                        id="n33"
                        className="bg-green-700 opacity-0 w-4 h-4 z-50 rounded-full absolute top-[50%] left-[84%]"
                  ></div>
                  <div
                        id="n34"
                        className="bg-green-700 opacity-0 w-4 h-4 z-50 rounded-full absolute top-[50%] left-[85.5%]"
                  ></div>
                  <div
                        id="n35"
                        className="bg-green-700 opacity-0 w-4 h-4 z-50 rounded-full absolute top-[65%] left-[84%]"
                  ></div>
                  <div
                        id="n36"
                        className="bg-green-700 opacity-0 w-4 h-4 z-50 rounded-full absolute top-[65%] left-[85.5%]"
                  ></div>
                  <div
                        id="n37"
                        className="bg-green-700 opacity-0 w-4 h-4 z-50 rounded-full absolute top-[67%] left-[84%]"
                  ></div>
                  <div
                        id="n38"
                        className="bg-green-700 opacity-0 w-4 h-4 z-50 rounded-full absolute top-[59%] left-[84%]"
                  ></div>
                  <div
                        id="n39"
                        className="bg-green-700 opacity-0 w-4 h-4 z-50 rounded-full absolute top-[40%] left-[16.5%]"
                  ></div>
                  <div
                        id="n40"
                        className="bg-green-700 opacity-0 w-4 h-4 z-50 rounded-full absolute top-[56%] left-[31.5%]"
                  ></div>
                  <div
                        id="n41"
                        className="bg-green-700 opacity-0 w-4 h-4 z-50 rounded-full absolute top-[56%] left-[48.5%]"
                  ></div>
                  <div
                        id="n42"
                        className="bg-green-700 opacity-0 w-4 h-4 z-50 rounded-full absolute top-[42%] left-[67.5%]"
                  ></div>

                  <div className="absolute z-[120] top-[56.5%] left-[5%]">
                        <button
                              className="bg-transparent w-28 h-36 flex justify-center items-center overflow-hidden"
                              onClick={() => toggleCategory("n4")}
                        >
                              <p className="bg-white text-black font-bold w-auto h-auto text-sm mx-4 flex items-center justify-center text-center break-words px-2">
                                    {getShelfName("n4")}
                              </p>
                        </button>
                  </div>

                  <div className="absolute z-[120] top-[53%] left-[18.5%]">
                        <button
                              className="bg-transparent w-32 h-44 flex justify-center items-center overflow-hidden"
                              onClick={() => toggleCategory("n10")}
                        >
                              <p className="bg-white text-black font-bold w-auto h-auto text-sm mx-4 flex items-center justify-center text-center break-words px-2">
                                    {getShelfName("n10")}
                              </p>
                        </button>
                  </div>

                  <div className="absolute z-[120] top-[58%] left-[35%]">
                        <button
                              className="bg-transparent w-36 h-20 flex justify-center items-center overflow-hidden"
                              onClick={() => toggleCategory("n11")}
                        >
                              <p className="bg-white text-black font-bold w-auto h-auto text-sm mx-4 flex items-center justify-center text-center break-words px-2">
                                    {getShelfName("n11")}
                              </p>
                        </button>
                  </div>

                  <div className="absolute z-[120] top-[44%] left-[18.5%]">
                        <button
                              className="bg-transparent w-32 h-20 flex justify-center items-center overflow-hidden"
                              onClick={() => toggleCategory("n13")}
                        >
                              <p className="bg-white text-black font-bold w-auto h-auto text-sm mx-4 flex items-center justify-center text-center break-words px-2">
                                    {getShelfName("n13")}
                              </p>
                        </button>
                  </div>

                  <div className="absolute z-[120] top-[43%] left-[35%]">
                        <button
                              className="bg-transparent w-36 h-28 flex justify-center items-center overflow-hidden"
                              onClick={() => toggleCategory("n14")}
                        >
                              <p className="bg-white text-black font-bold w-auto h-auto text-sm mx-4 flex items-center justify-center text-center break-words px-2">
                                    {getShelfName("n14")}
                              </p>
                        </button>
                  </div>

                  <div className="absolute z-[120] top-[43%] left-[4.5%]">
                        <button
                              className="bg-transparent w-32 h-20 flex justify-center items-center overflow-hidden"
                              onClick={() => toggleCategory("n6")}
                        >
                              <p className="bg-white text-black font-bold w-auto h-auto text-sm mx-4 flex items-center justify-center text-center break-words px-2">
                                    {getShelfName("n6")}
                              </p>
                        </button>
                  </div>

                  <div className="absolute z-[120] top-[22%] left-[4%]">
                        <button
                              className="bg-transparent w-36 h-36 flex justify-center items-center overflow-hidden"
                              onClick={() => toggleCategory("n8")}
                        >
                              <p className="bg-white text-black font-bold w-auto h-auto text-sm mx-4 flex items-center justify-center text-center break-words px-2">
                                    {getShelfName("n8")}
                              </p>
                        </button>
                  </div>

                  <div className="absolute z-[120] top-[23%] left-[19%]">
                        <button
                              className="bg-transparent w-36 h-36 flex justify-center items-center overflow-hidden"
                              onClick={() => toggleCategory("n17")}
                        >
                              <p className="bg-white text-black font-bold w-auto h-auto text-sm mx-4 flex items-center justify-center text-center break-words px-2">
                                    {getShelfName("n17")}
                              </p>
                        </button>
                  </div>

                  <div className="absolute z-[120] top-[23%] left-[36%]">
                        <button
                              className="bg-transparent w-36 h-36 flex justify-center items-center overflow-hidden"
                              onClick={() => toggleCategory("n19")}
                        >
                              <p className="bg-white text-black font-bold w-auto h-auto text-sm mx-4 flex items-center justify-center text-center break-words px-2">
                                    {getShelfName("n19")}
                              </p>
                        </button>
                  </div>

                  <div className="absolute z-[120] top-[61.5%] left-[51%]">
                        <button
                              className="bg-transparent w-96 h-10 flex justify-center items-center overflow-hidden"
                              onClick={() => toggleCategory("n23")}
                        >
                              <p className="bg-white text-black font-bold w-auto h-auto text-sm mx-4 flex items-center justify-center text-center break-words px-2">
                                    {getShelfName("n23")}
                              </p>
                        </button>
                  </div>

                  <div className="absolute z-[120] top-[52%] left-[51%]">
                        <button
                              className="bg-transparent w-96 h-14 flex justify-center items-center overflow-hidden"
                              onClick={() => toggleCategory("n26")}
                        >
                              <p className="bg-white text-black font-bold w-auto h-auto text-sm mx-4 flex items-center justify-center text-center break-words px-2">
                                    {getShelfName("n26")}
                              </p>
                        </button>
                  </div>

                  <div className="absolute z-[120] top-[43.5%] left-[51%]">
                        <button
                              className="bg-transparent w-96 h-12 flex justify-center items-center overflow-hidden"
                              onClick={() => toggleCategory("n42")}
                        >
                              <p className="bg-white text-black font-bold w-auto h-auto text-sm mx-4 flex items-center justify-center text-center break-words px-2">
                                    {getShelfName("n42")}
                              </p>
                        </button>
                  </div>

                  <div className="absolute z-[120] top-[22%] left-[52.5%]">
                        <button
                              className="bg-transparent w-96 h-40 flex justify-center items-center overflow-hidden"
                              onClick={() => toggleCategory("n29")}
                        >
                              <p className="bg-white text-black font-bold w-auto h-auto text-sm mx-4 flex items-center justify-center text-center break-words px-2">
                                    {getShelfName("n29")}
                              </p>
                        </button>
                  </div>

                  <div className="absolute z-[120] top-[23%] left-[86%]">
                        <button
                              className="bg-transparent w-28 h-36 flex justify-center items-center overflow-hidden"
                              onClick={() => toggleCategory("n31")}
                        >
                              <p className="bg-white text-black font-bold w-auto h-auto text-sm mx-4 flex items-center justify-center text-center break-words px-2">
                                    {getShelfName("n31")}
                              </p>
                        </button>
                  </div>

                  <div className="absolute z-[120] top-[41%] left-[86%]">
                        <button
                              className="bg-transparent w-28 h-36 flex justify-center items-center overflow-hidden"
                              onClick={() => toggleCategory("n34")}
                        >
                              <p className="bg-white text-black font-bold w-auto h-auto text-sm mx-4 flex items-center justify-center text-center break-words px-2">
                                    {getShelfName("n34")}
                              </p>
                        </button>
                  </div>

                  <div className="absolute z-[120] top-[58%] left-[86%]">
                        <button
                              className="bg-transparent w-28 h-36 flex justify-center items-center overflow-hidden"
                              onClick={() => toggleCategory("n36")}
                        >
                              <p className="bg-white text-black font-bold w-auto h-auto text-sm mx-4 flex items-center justify-center text-center break-words px-2">
                                    {getShelfName("n36")}
                              </p>
                        </button>
                  </div>

                  <img
                        src={storeimg}
                        alt="Mart Map"
                        className="top-44 left-7 absolute min-w-max w-[1000px] h-[540px] object-contain"
                  />
            </div>
      );
};

export default StoreMap;
