import React, {useState, useEffect} from 'react';
import "./Animation.css"
import {motion} from 'framer-motion';

function Banner() {
    const [animate, setAnimate] = useState(false);
    const [animateText, setAnimateText] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setAnimateText(true);
        }, 500);

        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        setAnimate(true);

        const timeout = setTimeout(() => {
            setAnimate(false);
        }, 4000);

        return () => clearTimeout(timeout);
    }, []);


    const textVariants = {
        hidden: {opacity: 0, y: '-100vh', scale: 0.8},
        visible: {opacity: 1, y: 0, scale: 1, transition: {type: 'spring', stiffness: 120}},
        exit: {opacity: 0, y: '100vh', scale: 0.5, transition: {duration: 1}}
    };
    return (
        <div className="relative h-screen border-2 border-gray-200">
            <img
                className="absolute top-0 left-0 h-auto w-full object-cover object-top"
                src="chlopek.png"
                alt="person"
            />

            <img
                className={`absolute top-0 left-0 h-auto w-full object-cover object-top ${animate ? 'lift-barbell' : ''}`}
                src="barbell.png"
                alt="barbell"
            />

            <motion.div
                className={`absolute top-[5vh] right-[20vw] flex flex-col items-end space-y-4`}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={textVariants}
            >
                <h1 className="text-[4vw] md:text-[3vw] lg:text-[4vw] xl:text-[5vw] text-black font-masque font-bold">Test</h1>
                <h1 className="text-[4vw] md:text-[3vw] lg:text-[4vw] xl:text-[5vw] text-black font-masque font-bold">Test</h1>
                <h1 className="text-[4vw] md:text-[3vw] lg:text-[4vw] xl:text-[5vw] text-black font-masque font-bold">Test!</h1>
            </motion.div>

            <div className="absolute top-[20vh] sm:top-[25vh] md:top-[30vh] lg:top-[40vh] xl:top-[50vh] right-[10vw]">
                <img src="./stars.png" alt="stars" className="w-[15vw] md:w-[15vw] lg:w-[15vw] xl:w-[15vw] h-auto"/>
            </div>

        </div>
    );
}

export default Banner;
