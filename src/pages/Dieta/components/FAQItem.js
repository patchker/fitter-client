import {AnimatePresence, motion} from "framer-motion";
import React from "react";

function FAQItem ({ faq, isOpen, onClick }) {
    return (
        <div>
            <dt
                className="text-lg leading-6 font-medium text-gray-900 cursor-pointer"
                onClick={onClick}
            >
                {faq.question}
            </dt>
            <AnimatePresence>
                {isOpen && (
                    <motion.dd
                        initial={{opacity: 0, height: 0}}
                        animate={{opacity: 1, height: 'auto'}}
                        exit={{opacity: 0, height: 0}}
                        transition={{duration: 0.3}}
                        className="mt-2 text-base text-gray-500"
                    >
                        {faq.answer}
                    </motion.dd>
                )}
            </AnimatePresence>
        </div>
    );
}
export default FAQItem;