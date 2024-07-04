import { LuDollarSign, LuFileCode, LuMessageCircle } from "react-icons/lu";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
const HomeScreen = () => {
  return (
    <div className="">
      <main className="container mx-auto px-6 py-12">
        {/* section for her */}

        {/* Main title */}

        <section className="block">
          <h1 className="text-4xl text-center text-purple-600">Balb</h1>
        </section>
        <section className="flex flex-row justify-center">
          <div className="w-[50%] p-10 justify-center flex flex-col xs:w-[100%]">
            <p className="text-3xl text-wrap max-w-[60%] leading-relaxed">
              Balb is the new way to{" "}
              <span className="bg-purple-500 select-none font-semibold text-white">
                Communicate
              </span>{" "}
              with your friends families & loved ones
            </p>
            {/* features */}
            <div className="flex flex-col gap-5 mt-6">
              <div className="flex flex-row gap-2 items-center">
                <LuMessageCircle size={30} className="text-purple-500" />
                <p className="text-gray-600">*Realtime* Communication</p>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <LuFileCode size={30} className="text-purple-500" />
                <p className="text-gray-600">Send Images and Documents</p>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <LuDollarSign size={30} className="text-purple-500" />
                <p className="text-gray-600">Free for everyone</p>
              </div>
            </div>
            {/* Button To Get Started */}
            <div className="flex justify-center">
              <motion.button
                whileTap={{ scale: 0.9 }}
                drag="x"
                dragConstraints={{ left: -100, right: 100 }}
                className="bg-purple-600 text-white w-[30%] rounded-full mt-12 h-10"
              >
                <Link to={"/auth/login"}>Lets get Abord</Link>
              </motion.button>
            </div>
          </div>
          <div className="w-[50%] xs:none">
            <img src="./hero.png" className="" />
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomeScreen;
