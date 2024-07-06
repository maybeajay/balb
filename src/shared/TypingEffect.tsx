import React, { useState, useEffect} from 'react' 

type TypingProps ={
    words: string[],
    typingSpeed: number,
    deletingSpeed: number,
    pauseTime: number,
}

const TypingEffect = ({words, typingSpeed = 150, deletingSpeed = 100, pauseTime= 1500}:TypingProps)=>{
    const [index, setIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [currentWord, setCurrentWord] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    useEffect(() => {
        let typingTimeout;
    
        if (isDeleting) {
          typingTimeout = setTimeout(() => {
            setCurrentWord((prev) => prev.slice(0, -1));
            setCharIndex((prev) => prev - 1);
          }, deletingSpeed);
        } else {
          typingTimeout = setTimeout(() => {
            setCurrentWord(words[index].slice(0, charIndex + 1));
            setCharIndex((prev) => prev + 1);
          }, typingSpeed);
        }
    
        if (!isDeleting && charIndex === words[index].length) {
          setTimeout(() => setIsDeleting(true), pauseTime);
        } else if (isDeleting && charIndex === 0) {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % words.length);
        }
    
        return () => clearTimeout(typingTimeout);
      }, [charIndex, isDeleting, index, words, typingSpeed, deletingSpeed, pauseTime]);  
    return(
        <>
        <span className="mx-2 mt-5 font-semibold text-black">{currentWord}</span>
        </>
    )
}

export default TypingEffect;