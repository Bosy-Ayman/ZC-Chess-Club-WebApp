import React from 'react';

export default function Footer() {
  return (
    <footer className="flex flex-col gap-6 px-5 py-10 text-center @container">
      <div className="flex flex-wrap items-center justify-center gap-6 @[480px]:flex-row @[480px]:justify-around">
        <a className="text-[#bab19c] text-base font-normal leading-normal min-w-40" href="#">Terms of Service</a>
        <a className="text-[#bab19c] text-base font-normal leading-normal min-w-40" href="#">Privacy Policy</a>
        <a className="text-[#bab19c] text-base font-normal leading-normal min-w-40" href="#">Contact Us</a>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {/* Facebook */}
        <a href="https://www.facebook.com/chessclubzc">
          <div className="text-[#bab19c]" data-icon="FacebookLogo" data-size="24px" data-weight="regular">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm8,191.63V152h24a8,8,0,0,0,0-16H136V112a16,16,0,0,1,16-16h16a8,8,0,0,0,0-16H152a32,32,0,0,0-32,32v24H96a8,8,0,0,0,0,16h24v63.63a88,88,0,1,1,16,0Z" />
            </svg>
          </div>
        </a>
        {/* Instagram */}

        <a href="https://www.instagram.com/zc.chessclub/">
          <div className="text-[#bab19c]" data-icon="InstagramLogo" data-size="24px" data-weight="regular">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z" />
            </svg>
          </div>
        </a>
    {/* Lichess - Knight Icon */}
    <a href="https://lichess.org/team/zewail-city-ust" target="_blank" rel="noopener noreferrer" >
        <img 
            src="/Icons/Lichess.png"    
            alt="Lichess Knight Icon" 
            width="27" 
            height="27" 
            style={{ filter: "brightness(0) invert(0.7)" }} 
        />
        </a>

    {/* Chess.com - Pawn Icon */}
    <a href="https://www.chess.com/club/zewail-city-ust" target="_blank" rel="noopener noreferrer" >
    <img 
        src="/Icons/chess_com.png"  
        alt="Chess.com Pawn Icon" 
        width="50" 
        height="50" 
        style={{ filter: "brightness(0) invert(0.7)" }} 
    />
</a>
      </div>
    
    <p className="text-[#bab19c] text-base font-normal leading-normal">© 2025 ZC Chess Club. All rights reserved.</p>
    </footer>
  );
}
