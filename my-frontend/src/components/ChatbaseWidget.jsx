import { useEffect } from "react";

export default function ChatbaseWidget() {
  useEffect(() => {
   
    if (document.getElementById("TAprqM6ci1JBDux7L5ebZ")) return;

    
    const script = document.createElement("script");
    script.innerHTML = `
      (function(){
        if(!window.chatbase||window.chatbase("getState")!=="initialized"){
          window.chatbase=(...arguments)=>{
            if(!window.chatbase.q){window.chatbase.q=[]}
            window.chatbase.q.push(arguments)
          };
          window.chatbase=new Proxy(window.chatbase,{
            get(target,prop){
              if(prop==="q"){return target.q}
              return(...args)=>target(prop,...args)
            }
          })
        }
        const onLoad=function(){
          const script=document.createElement("script");
          script.src="https://www.chatbase.co/embed.min.js";
          script.id="TAprqM6ci1JBDux7L5ebZ";
          script.domain="www.chatbase.co";
          document.body.appendChild(script)
        };
        if(document.readyState==="complete"){onLoad()}
        else{window.addEventListener("load",onLoad)}
      })();
    `;
    document.body.appendChild(script);

    // 💅 Custom styling for chat window
    const style = document.createElement("style");
    style.innerHTML = `
      /* Chatbase Chatbot window styling */
      iframe[title="chatbase-chatbot"] {
        width: 400px !important;        /* Chat window width */
        height: 50vh !important;        /* 👈 Takes half the screen height */
        max-height: 50vh !important;    /* Ensures it doesn't expand */
        bottom: 50px !important;        /* Adjusts spacing from bottom */
        right: 22px !important;
        border-radius: 18px !important;
        overflow: hidden;
        box-shadow: 0 8px 20px rgba(0,0,0,0.25);
        transition: all 0.3s ease-in-out;
        border: 2px solid #059669 !important; /* AgriHills green border */
        background-color: white !important;
      }

      /* Optional: chat bubble animation */
      .chatbase-launcher-button {
        animation: pulse 2s infinite;
      }

      @keyframes pulse {
        0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(5,150,105,0.4); }
        70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(5,150,105,0); }
        100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(5,150,105,0); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  return null;
}