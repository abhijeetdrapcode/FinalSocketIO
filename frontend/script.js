const headers = {
  'Host': window.location.host,
  'Connection': navigator.connection ? navigator.connection.effectiveType : '',
  'sec-ch-ua': navigator.userAgentData ? navigator.userAgentData.brands.map(brand => `"${brand.brand.replace(/"/g, '\\"')}"; v="${brand.version}"`).join(' ') : '',
  'sec-ch-ua-platform': navigator.userAgentData ? `"${navigator.userAgentData.platform}"` : '',
  'User-Agent': navigator.userAgent,
  'Origin': window.location.origin,
  'Sec-Fetch-Site': window.location.origin ? 'same-origin' : 'cross-site',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Dest': 'document',
  'Referer': document.referrer
};

const socket = io('http://localhost:3000', {
  transports: ['websocket'],
  extraHeaders: headers,
});

function emitClickData(eventType, selector) {
  attachEventListeners(selector, eventType);
}

function emitClickDataByIdOrClass(eventType, idOrClass) {
  const selector = `[id="${idOrClass}"], .${idOrClass}`;
  attachEventListeners(selector, eventType);
}

function attachEventListeners(selector, eventType) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(element => {
    element.addEventListener(eventType, async (event) => {
      const data = createEventData(event);
      try {
        data.ipAddress = await fetchIPAddress();
      } catch (error) {
        console.error('Error fetching IP address:', error);
        data.ipAddress = '';
      }
      emitData(data);
    });
  });
}

function createEventData(event) {
  return {
    tag: event.target.tagName.toLowerCase(),
    text: event.target.innerText,
    id: event.target.id,
    class: event.target.className,
    headers: headers,
    localStorageData: getStorageData(localStorage),
    sessionStorageData: getStorageData(sessionStorage),
  };
}

function getStorageData(storage) {
  const data = {};
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    const value = storage.getItem(key);
    try {
      data[key] = JSON.parse(value);
    } catch (e) {
      data[key] = value;
    }
  }
  return data;
}

async function fetchIPAddress() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error fetching IP address:', error);
    return '';
  }
}

function emitData(data) {
  socket.emit('clickData', data);
}

socket.on('clickDataSaved', (payload) => {
  console.log(payload.message);
  console.log("Data Saved to MongoDB");
});

socket.on('clickDataError', (payload) => {
  console.error(payload.message);
});

// Usage examples:
emitClickData('click', 'a');
// emitClickDataByIdOrClass('click', 'display-4');
// emitClickDataByIdOrClass('click', 'form-control');
// emitClickDataByIdOrClass('click', 'col-md-4');
emitClickDataByIdOrClass('click', 'Testing2');