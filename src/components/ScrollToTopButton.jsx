import React from 'react';

const ScrollToTopButton = () => {
  // Funzione per scrollare la pagina verso l'alto
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',  // Fa in modo che lo scroll sia fluido
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className='btn btn-secondary'
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        borderRadius: '50%'
      }}
    >
<i className="fa-solid fa-arrow-up"></i>    
</button>
  );
};

export default ScrollToTopButton;
