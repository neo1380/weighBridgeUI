var port,
  textEncoder,
  // eslint-disable-next-line no-unused-vars
  writableStreamClosed,
  // eslint-disable-next-line no-unused-vars
  writer;

const serialResultsDiv = document.getElementById("serialResults");
async function connectSerial() {
  try {
    // Prompt user to select any serial port.
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });
    // eslint-disable-next-line no-undef
    textEncoder = new TextEncoderStream();
    writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
    writer = textEncoder.writable.getWriter();
    await listenToPort();
  } catch (e) {
    alert("Serial Connection Failed" + e);
  }
}

async function listenToPort() {
  // eslint-disable-next-line no-undef
  const textDecoder = new TextDecoderStream();
  // eslint-disable-next-line no-unused-vars
  const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
  const reader = textDecoder.readable.getReader();
  // Listen to data coming from the serial device.
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      // Allow the serial port to be closed later.
      console.log("[readLoop] DONE", done);
      reader.releaseLock();
      break;
    }
    // value is a string.
    appendToTerminal(value);
  }
}

async function appendToTerminal(newStuff) {
  console.log("serialResultsDiv");
  console.log(serialResultsDiv);
  if (serialResultsDiv) {
    serialResultsDiv.innerHTML += newStuff;
    if (serialResultsDiv.innerHTML.length > 3000)
      serialResultsDiv.innerHTML = serialResultsDiv.innerHTML.slice(
        serialResultsDiv.innerHTML.length - 3000
      );

    //scroll down to bottom of div
    serialResultsDiv.scrollTop = serialResultsDiv.scrollHeight;
  }
  document.getElementById("serialInput").value = formatValue(newStuff);

  return newStuff;
}

function formatValue(str) {
  // const str = "US,NT,-113.0254kg";
  const res = str
    .replace("US", "")
    .replace("NT", "")
    .replace("kg", "")
    .replace(/,/g, "");

  return Math.abs(res);
}
export function getSerialData() {
  console.log("Invoked serial data method....");
  connectSerial();
}

export function readSerialData() {
  console.log("Invoked read serial data method....");
  const value = (async () => {
    console.log(await connectSerial());
  })();
  console.log("Value from serial data...", value);
  return formatValue(value);
}
