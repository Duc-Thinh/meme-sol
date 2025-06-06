"use client";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import Image from "next/image";
import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import useInputControls, {
  pieDataFromControls,
} from "./3dpie/useInputControls";
import Turntable from "./3dpie/Turntable";
import Effects from "./3dpie/Effects";
import Pie from "./3dpie/Pie";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { useMemo } from "react";

export default function Home() {
  const orbitControlsRef = useRef(null);
  const [controlValues, setControlValues]: any = useInputControls();
  const data = pieDataFromControls(controlValues);

  // Ensure controlValues is the correct object before destructuring
  const {
    innerRadius,
    outerRadius,
    cornerRadius,
    padAngle,
    ambientLightIntensity,
    roughness,
    metalness,
    valueLabelPosition,
    showBloom,
    bloomStrength,
    bloomRadius,
    bloomThreshold,
    spinSpeed,
    backgroundColor,
    showValues,
    valuesAsPercent,
  } =
    typeof controlValues === "object" && controlValues !== null
      ? controlValues
      : ({} as any);

  const logos = [
    { src: "coinbase.png", label: "Coinbase" },
    { src: "okx.png", label: "OKX" },
    { src: "bybit.png", label: "Bybit" },
    { src: "huobi.png", label: "Huobi" },
    { src: "kraken.png", label: "Kraken" },
    { src: "bitget.png", label: "Bitget" },
  ];

  const logosLoop = useMemo(() => [...logos, ...logos, ...logos], []);

  return (
    <div className="w-full h-screen flex-col items-center justify-center">
      <div className="frame-1 w-full h-[780px] flex items-center justify-center flex-col gap-3">
        <span className="text-[120px] font-bold leading-[100%]">$MUSK</span>
        <div className="w-[240px] h-[64px] flex items-center justify-center rounded-2 py-[16px] px-[29.5px] bg-white border-[3px] border-black">
          <span className="text-black text-[20px] font-bold leading-[24px] tracking-[0%] whitespace-nowrap">
            CONNECT WALLET
          </span>
        </div>
        <div className="text-center whitesplace-balance max-w-[782px]">
          <span className="font-bold text-[#00A6FF]">MUSK COIN ($MUSK) </span>
          <span>
            is created to honor Elon Musk- the world’s most influential
            billionaire - by celebrating his bold vision, innovation, and global
            impact through a powerful crypto symbol.
          </span>
        </div>
        <div className="flex flex-row items-center justify-center">
          <div className="rounded-full border-3 border-white py-2 px-10 bg-[#007AFF] font-bold">
            <span>BUY $MUSK</span>
          </div>
          <div className="bg-white flex items-center justify-center ml-4 p-1">
            <Image
              src="/tele-icon.svg"
              alt="tele-icon"
              width={30}
              height={30}
            />
          </div>
          <div className="bg-white flex items-center justify-center ml-4 p-1">
            <Image src="/x-icon.png" alt="tele-icon" width={30} height={30} />
          </div>
        </div>
      </div>
      <div className="frame-2 w-full h-[1042px] flex items-center justify-start flex-col relative">
        <div className="flex flex-col items-center justify-start z-10">
          <div className="font-bold text-[64px]">TOKENOMICS</div>
          <span>
            Let’s build the{" "}
            <span className="font-bold text-[#00A6FF]">$MUSK</span> Army to
            Mars. Pump it hard!
          </span>
          <div className="mt-6 rounded-full border-3 border-white py-2 px-10 bg-[#007AFF] font-bold">
            <span>BUY $MUSK</span>
          </div>
        </div>
        <div className="flex flex-col absolute right-0 top-1/2 -translate-y-[55%] w-[800px] h-[1000px] flex items-center justify-center">
          <Canvas
            shadows
            dpr={[1, 2]}
            camera={{ position: [3, 3, 4], fov: 50 }}
          >
            <directionalLight
              position={[0, 10, 0]}
              intensity={2.5}
              castShadow
            />
            <ambientLight intensity={ambientLightIntensity} />

            <spotLight
              intensity={2.5}
              angle={0.2}
              penumbra={1}
              position={[10, 15, 10]}
              castShadow
            />
            <pointLight position={[0, 5, 0]} intensity={1.5} />

            <Suspense fallback={null}>
              <Turntable enabled={spinSpeed > 0} speed={spinSpeed * 0.02}>
                <Pie
                  data={data}
                  innerRadius={innerRadius}
                  outerRadius={outerRadius}
                  cornerRadius={cornerRadius}
                  padAngle={padAngle}
                  roughness={roughness}
                  metalness={metalness}
                  valueLabelPosition={valueLabelPosition}
                  showValues={showValues}
                  valuesAsPercent={valuesAsPercent}
                  onClickSlice={(i: any) =>
                    setControlValues({
                      [`explode${i}`]: !(controlValues as any)[`explode${i}`],
                    })
                  }
                />
              </Turntable>
            </Suspense>
            <ContactShadows
              rotation-x={Math.PI / 2}
              position={[0, -0.4, 0]}
              opacity={0.65}
              width={30}
              height={30}
              blur={1.5}
              far={0.8}
            />
            <OrbitControls
              ref={orbitControlsRef}
              maxPolarAngle={Math.PI / 2}
              enableZoom={false}
              enablePan={false}
            />
            {showBloom && (
              <Effects
                backgroundColor={backgroundColor}
                bloomStrength={bloomStrength}
                bloomThreshold={bloomThreshold}
                bloomRadius={bloomRadius}
              />
            )}
          </Canvas>
          <div className="absolute w-[420px] top-[750px] right-20">
            <div className="whitespace-nowrap flex flex-col items-center justify-center gap-2 bg-[#FFFFFF33] py-4 px-[61px] rounded-[16px]">
              <span>TOTAL SUPPLY</span>
              <span className="font-bold text-white text-[32px]">
                100,000,000,000 $MUSK
              </span>
            </div>
            <div className="mt-4 flex flex-col items-center justify-center gap-2 bg-[#FFFFFF33] py-4 px-[61px] rounded-[16px]">
              <span>TOKEN ADDRESS</span>
              <span className="font-bold text-white text-[32px]">---</span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-[240px] bg-black flex items-center justify-center">
        <Swiper
          slidesPerView={6}
          spaceBetween={30}
          loop={true}
          speed={3000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
            reverseDirection: false
          }}
          modules={[Autoplay, Pagination, Navigation]}
          className="mySwiper w-full"
          style={{
            padding: '20px 0',
          }}
        >
          {logosLoop.map((src, idx) => (
            <SwiperSlide key={idx}>
              <div className="flex items-center justify-center h-full hover:scale-110 transition-transform duration-300">
                <Image 
                  alt={`logo-${idx}`} 
                  src={`/icons/${src}`} 
                  width={60} 
                  height={60}
                  className="opacity-50 hover:opacity-100 transition-opacity duration-300"
                />
                <span>

                </span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
