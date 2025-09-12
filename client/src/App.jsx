import Customroute from "./routers/Customroute";
import FullScreen from "./components/FullScreen";

export default function App() {
      const appRef = useRef(null);

      return (
            <>
                  <div
                        ref={appRef}
                        style={{
                              minHeight: "100vh",
                              display: "flex",
                              flexDirection: "column",
                        }}
                  >
                        <FullScreen containerRef={appRef} />

                        <main>
                              <Customroute />
                        </main>
                  </div>
            </>
      );
}
