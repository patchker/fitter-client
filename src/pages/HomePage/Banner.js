import React, {useState, useEffect} from 'react';
import "./Animation.css"
import {motion} from 'framer-motion';


function Banner() {
    const [animate, setAnimate] = useState(false);
    const [currentImage, setCurrentImage] = useState("./chlopek.png");
    const [currentBarbell, setCurrentBarbell] = useState("./barbell.png");
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 640);

    useEffect(() => {
        setAnimate(true);

        const handleResize = () => {
            if (window.innerWidth <= 640) {
                setCurrentImage("./chlopek_short.png");
                setCurrentBarbell("./barbell.png");
                setIsSmallScreen(true);
            } else {
                setCurrentImage("./chlopek.png");
                setCurrentBarbell("./barbell_short.png");
                setIsSmallScreen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
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

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 640) {
                setCurrentImage("./chlopek_short.png");
                setCurrentBarbell("./barbell_short.png");
            } else {
                setCurrentImage("/chlopek.png");
                setCurrentBarbell("./barbell.png");

            }
        };

        // Ustawienie nasłuchiwacza zdarzeń
        window.addEventListener('resize', handleResize);

        // Wywołanie początkowe
        handleResize();

        // Usunięcie nasłuchiwacza zdarzeń przy demontażu komponentu
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    return (
        <div className={`relative h-auto border-2 border-gray-200 ${isSmallScreen && ''}`}>
            <div className="image-container">
                <img className="focused-image" src={currentImage} alt="person" />





            <img
                className={`absolute top-0 left-0 h-auto w-full object-cover object-top small-screen-background ${(animate && !isSmallScreen  )   ? 'lift-barbell' : ''}`}
                src={currentBarbell}
                alt="barbell"
            />
            </div>

            <motion.div                 className={` flex justify-center items-center md:mt-0 md:absolute ${isSmallScreen ? 'top-[80vh] right-[60vw] ' : 'top-[20vh]'} right-[30vw]`}>

            <motion.h1
                    className={`${isSmallScreen ? 'text-[14vw] whiteText2' : 'text-[5vw] whiteText'} absolute font-bungee font-bold`}
                    style={{
                        top: '50%',
                        left: '50%',
                        translateX: isSmallScreen ? '-40%' : '-50%',
                        translateY: '-70%',
                    }}
                    variants={topTextVariants}
                    initial="hidden"
                    animate="visible"
                >
                    Odkryj
                </motion.h1>
                <motion.h1
                    className={` ${isSmallScreen ? 'text-[16vw] whiteText2' : 'text-[6vw] outlinedText'} absolute  font-bungee font-bold`}
                    style={{
                        top: '50%',
                        left: '50%',
                        translateX: isSmallScreen ? '-55%' : '-50%',
                        translateY: '-45%',
                    }}
                    variants={middleTextVariants}
                    initial="hidden"
                    animate="visible"
                >
                    swoją
                </motion.h1>
                <motion.h1
                    className={` ${isSmallScreen ? 'text-[14vw] whiteText2' : 'text-[7vw] blackText'} absolute  font-bungee font-bold`}
                    style={{
                        top: '50%',
                        left: '50%',
                        translateX: isSmallScreen ? '-80%' : '-50%',
                        translateY: isSmallScreen ? '-60%' : '-35%',
                    }}
                    variants={bottomTextVariants}
                    initial="hidden"
                    animate="visible"
                >
                    siłę!
                </motion.h1>
            </motion.div>

            <div className={`absolute top-[20vh] sm:top-[25vh] md:top-[30vh] lg:top-[40vh] xl:top-[50vh] right-[10vw] ${isSmallScreen ? 'top-[30vh] ' : 'top-[10vh]'}`}>
                <img src="./stars.png" alt="stars" className="w-[15vw] md:w-[15vw] lg:w-[15vw] xl:w-[15vw] h-auto"/>
            </div>

        </div>
    );
}

export default Banner;
