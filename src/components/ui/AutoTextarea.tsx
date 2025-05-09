import React, { useRef, useEffect } from 'react';

const AutoTextarea = ({ text, setText }: { text: string; setText: (v: string) => void }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    autoResize();
  };

  const autoResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // reset
      textarea.style.height = `${textarea.scrollHeight}px`; // grow
    }
  };

  useEffect(() => {
    autoResize(); // ajusta ao montar
  }, [text]);

  return (
    <textarea
      ref={textareaRef}
      value={text}
      onChange={handleInput}
      placeholder="Preview"
      className="w-full resize-none overflow-hidden pointer-events-none p-4 border border-none dark:border-none rounded-md focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      rows={1}
    />
  );
};

export default AutoTextarea;
