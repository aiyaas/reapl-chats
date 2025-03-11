'use strict';

// HTML element variables
const elements = {
  inputUser: document.querySelector('#inputUser'),
  sendBtn: document.querySelector('#send'),
  dellChat: document.querySelector('#dellChat'),
  useChat: document.querySelector('#message'),
  optionFeature: document.querySelector('#SELECTOR'),
  showNumMsg: document.querySelector('#numMsg'),
  showToken: document.querySelector('#token'),
  showSplitJd: document.querySelector('#msgSplitJd'),
  startRecord: document.querySelector('#useRecord'),
};

// Initial configuration
const config = {
  region: 'id-ID',
  token: 1000, // Use Infinity to create unlimited tokens
  resetTime: [15, 1, 1], // Set reset time at 00:00:00
  setDisabledInput: 4,
};
 
const initialInputHeight = elements.inputUser.scrollHeight;
const store = JSON.parse(localStorage.getItem('m.key')) || [];
let tokenCount = parseInt(localStorage.getItem('integer_q')) || 0;

// Utility functions
const utils = {
  getCurrentTime: () =>
    new Date().toLocaleString(config.region, { weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }),
  updateLocalStorage: (key, value) => localStorage.setItem(key, JSON.stringify(value,null,2)),
  showNotice: (message, duration = 3000) => {
    const popUp = document.querySelector('#pop_up');
    if (!popUp) return console.error('Element #pop_up not found!');
    
    popUp.innerHTML = message // Use message from page 
    popUp.style.display = 'block'
    
    setTimeout(() => {
      popUp.style.display = 'none';
      popUp.innerHTML = ''; // Remove 
    }, duration);
  }
};


// Fungsi utama
function useMultiAuthState(message, role, copyElemt,) {
  store.push({
    role, message, time: utils.getCurrentTime(), 
    copyElemt,
  });
  utils.updateLocalStorage('m.key', store);
}

(() => {
  store.forEach(chat => {
    const time = chat.role === 'client' ? chat.time : '';
    const copy = chat.role === 'client' ? '' : chat.copyElemt;
    elements.useChat.innerHTML += `
      <li class="${chat.role === 'client' ? 'repaly' : 'sender'}">
        <section>${chat.message}</section>
        <div class="time">${copy}&emsp;${time}</div>
      </li>`;
  });
})();

async function handleOutgoingChat() {
  const message = elements.inputUser.value.trim();
  const option = elements.optionFeature.value;
  if (!message) return;
  elements.inputUser.value = '';
  elements.inputUser.style.height = `${initialInputHeight}px`;
  // Handle user input with replace /Url/Html/Sensor
  const msg_rpl = message 
    .replace(/<(.*?)>/gis, '&#60;$1&#62;') //Html
    .replace(/\b((?:https?|ftp):\/\/[^\s\°]+)/g, '<a href="$1">$1</a> ') //Url
    .replace(new RegExp(as['HARM_CATEGORY_DANGEROUS_CONTENT'].join('|'), 'gi'), '****'); //Sensor
  
  useMultiAuthState(msg_rpl, 'client');
    elements.useChat.innerHTML += `
      <li class="repaly">
        <section>${msg_rpl}</section>
        <div class="time">${utils.getCurrentTime()}</div>
      </li>`;
      
  // Spinner animation when sending chat is quite long
  elements.sendBtn.disabled = true;
  elements.sendBtn.innerHTML =  '<svg class="spinner" width="18px" height="18px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none" class="hds-flight-icon--animation-loading"><g fill="#fff" fill-rule="evenodd" clip-rule="evenodd"><path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8z" opacity=".2"/><path d="M7.25.75A.75.75 0 018 0a8 8 0 018 8 .75.75 0 01-1.5 0A6.5 6.5 0 008 1.5a.75.75 0 01-.75-.75z"/></g></svg>';
      
  try {
    let response = await executeFeature(option, message); // Fetch response
    if (config.token - tokenCount <= 0) {
      utils.showNotice(`Daily token has been reached, come back at <span style="color:#ff6a80;">${config.resetTime}</span>`);
      return;
    }
    tokenCount++;
    const copyElemt = '<span onclick="useClipboard()"><svg width="13px" height="13px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md-heavy"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 5C7 3.34315 8.34315 2 10 2H19C20.6569 2 22 3.34315 22 5V14C22 15.6569 20.6569 17 19 17H17V19C17 20.6569 15.6569 22 14 22H5C3.34315 22 2 20.6569 2 19V10C2 8.34315 3.34315 7 5 7H7V5ZM9 7H14C15.6569 7 17 8.34315 17 10V15H19C19.5523 15 20 14.5523 20 14V5C20 4.44772 19.5523 4 19 4H10C9.44772 4 9 4.44772 9 5V7ZM5 9C4.44772 9 4 9.44772 4 10V19C4 19.5523 4.44772 20 5 20H14C14.5523 20 15 19.5523 15 19V10C15 9.44772 14.5523 9 14 9H5Z" fill="#4a5568"></path></svg></span>';
    useMultiAuthState(response, 'system', copyElemt,);
    elements.useChat.innerHTML += `
      <li class="sender">
        <section>${response}</section>
        <div class="time">
          ${copyElemt}
        </div>
      </li>`;
    
    const splitJd = `${response.split('.')[0].substring(0, 28)}... .`; 
    const showInfoToken = `<button class="form-control" style="--b:#f6f7fa;margin-right:4px;width:40px" id="token">${config.token - tokenCount}</button>`;
    const num_child = elements.useChat.children.length;
    elements.showSplitJd.textContent = splitJd;
    elements.showNumMsg.textContent = num_child;
    elements.showToken.innerHTML = showInfoToken;
    localStorage.setItem('integer_q', tokenCount);
    localStorage.setItem('split_jd', splitJd);
    localStorage.setItem('num_child', num_child);
    localStorage.setItem('infoToken', showInfoToken);
  } catch (error) {
    return console.error(error.stack);
  } finally {
    elements.sendBtn.disabled = false;
    elements.sendBtn.innerHTML = '<svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="Arrow / Arrow_Up_MD"><path id="Vector" d="M12 19V5M12 5L6 11M12 5L18 11" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g></svg>';
  }
  
  // Add handling to add culdwon to user input as a premium feature 
  elements.inputUser.disabled = true;
  let setTimeColdwon = config.setDisabledInput;
  let disabledInput = setInterval(() => {
    elements.inputUser.placeholder =
      setTimeColdwon > 0 ?
      `Can send in ${setTimeColdwon--}s, limit` :
      (clearInterval(disabledInput),
        (elements.inputUser.disabled = false),
        (elements.inputUser.placeholder = `Ask Assistant, like @ How are you.`));
  }, 1000);
  
  elements.useChat.scrollTo(0, elements.useChat.scrollHeight); // scroll to bottom of the chat container
}

// Function to set token reset
function resetDailyToken(stopOperation, setTokenResetTime) {
  if (stopOperation === false) {
    const now = new Date();
    const resetTime = new Date(now.setHours(
      setTokenResetTime[0], // clock
      setTokenResetTime[1], // minutes
      setTokenResetTime[2], // seconds
      0 // Set milliseconds to 0
    ));

    // Calculate the time remaining until reset
    let timeToReset = resetTime - new Date();
    if (timeToReset < 0) {
      // If the reset time has passed, add 24 hours
      timeToReset += 24 * 3600 * 1000;
    }
    setTimeout(function() {
      alert(`Token has been reset! Happy using, ${token} tokens are restored. Reload your website!`);
      
      // Reset token every specified hour 
      setInterval(function() {
        localStorage.removeItem('integer_q');
      }, 24 * 3600 * 1000);
    }, timeToReset);
  }
}

// Add copy button to grab text from object class to make it easier to copy text to clipboard 
function useClipboard() {
  const bubbleCopy = event.target.closest('.sender');
  utils.showNotice('Text has been copied to the clipboard!');
  return navigator
    .clipboard
    .writeText(bubbleCopy.textContent.trim());
}

// Set the configuration to take the sound and return it to text form
elements.startRecord.addEventListener('click', () => {
  var speech = true;
  window.SpeechRecognition = window.webkitSpeechRecognition;

  const recognition = new SpeechRecognition();
  recognition.interimResults = true;
  recognition.lang = config.region; // region Indonesian

  recognition.addEventListener('result', (e) => {
    const transcript = Array.from(e.results)
      .map((result) => result[0])
      .map((result) => result.transcript)
      .join('');

    elements.inputUser.value = transcript; // Show recorded text
  });

  if (speech == true) {
    recognition.start();
  }
});

// Event Listener
elements.inputUser.addEventListener('input', () => {
  // Adjust the height of the input field dynamically based on its content
  elements.inputUser.style.height = `${initialInputHeight}px`;
  elements.inputUser.style.height = `${elements.inputUser.scrollHeight}px`;
});

elements.inputUser.addEventListener('keydown', (e) => {
  // If the Enter key is pressed without Shift and the window width is larger 
  // than 800 pixels, handle the outgoing chat
  if (e.key === 'Enter' && !e.shiftKey && window.innerWidth > 800) {
    return e.preventDefault() + handleOutgoingChat();
  }
});

elements
.showToken
.innerHTML = localStorage.getItem('infoToken');
elements
.showNumMsg
.textContent = localStorage.getItem('num_child');
elements
.showSplitJd
.textContent = localStorage.getItem('split_jd');

elements.sendBtn.addEventListener('click', handleOutgoingChat);

utils.showNotice("<b>Welcome to <span style='color:#2aa198;'>Reapl</span>, your personal AI assistant</b> <br><br> All your inputs such as chats with (Reapl) are not used for any specific purposes so you don't need to worry about your data, all chat data is stored in browser cookies.", 30000);

elements.dellChat.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear? This action cannot be undone.')) {
    elements.useChat.innerHTML = '';
    localStorage.removeItem('m.key');
    localStorage.removeItem('num_child');
    localStorage.removeItem('split_jd');
    utils.showNotice('All chat messages have been cleared successfully. Reload the website!');
  }
});

// Initialisation 
resetDailyToken(true, config.resetTime);

