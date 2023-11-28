import React, {useState, useEffect} from 'react';
import "./Animation.css"
import {motion} from 'framer-motion';

function Banner() {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setAnimate(true);



    }, []);

    const sharedStartPosition = { opacity: 0.2, x: '0vw', y: '0vh', scale: 1 };

    const topTextVariants = {
        hidden: { ...sharedStartPosition, scale: 0.8 },
        visible: animate ? { opacity: 1, x: '5vw', y: '-7vh', scale: 1.2, transition: { type: 'spring', stiffness: 120, damping: 14, delay: 0.1 } } : { ...sharedStartPosition, scale: 0.8 }
    };

    const bottomTextVariants = {
        hidden: { ...sharedStartPosition, scale: 0.8 },
        visible: animate ? { opacity: 1, x: '-5vw', y: '10vh', scale: 1.2, transition: { type: 'spring', stiffness: 120, damping: 14, delay: 0.15 } } : { ...sharedStartPosition, scale: 0.8 }
    };

    const middleTextVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { delay: 0.05, duration: 0.4 } }
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


            <motion.div className="absolute top-[20vh] right-[20vw]">
                <motion.h1
                    className="absolute text-[2vw] whiteText font-masque font-bold"
                    style={{ top: '50%', left: '50%', translateX: '-50%', translateY: '-50%' }} // Wspólna pozycja startowa
                    variants={topTextVariants}
                    initial="hidden"
                    animate="visible"
                >
                    Test
                </motion.h1>
                <motion.h1
                    className="absolute text-[4vw] outlinedText font-masque font-bold"
                    style={{ top: '50%', left: '50%', translateX: '-50%', translateY: '-50%' }} // Wspólna pozycja startowa
                    variants={middleTextVariants}
                    initial="hidden"
                    animate="visible"
                >
                    Test
                </motion.h1>
                <motion.h1
                    className="absolute text-[5vw] blackText font-masque font-bold"
                    style={{ top: '50%', left: '50%', translateX: '-50%', translateY: '-50%' }} // Wspólna pozycja startowa
                    variants={bottomTextVariants}
                    initial="hidden"
                    animate="visible"
                >
                    Test!
                </motion.h1>
            </motion.div>

            <div className="absolute top-[20vh] sm:top-[25vh] md:top-[30vh] lg:top-[40vh] xl:top-[50vh] right-[10vw]">
                <img src="./stars.png" alt="stars" className="w-[15vw] md:w-[15vw] lg:w-[15vw] xl:w-[15vw] h-auto"/>
            </div>

        </div>
    );
}

export default Banner;
