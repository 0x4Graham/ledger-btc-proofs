import 'core-js/actual';
import { listen } from "@ledgerhq/logs";
import AppBtc from "@ledgerhq/hw-app-btc";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import bitcoinMessage from "bitcoinjs-message";
import Message from "bitcore-message"
// Keep this import if you want to use a Ledger Nano S/X/S Plus with the USB protocol and delete the @ledgerhq/hw-transport-webhid import
// Keep this import if you want to use a Ledger Nano S/X/S Plus with the HID protocol and delete the @ledgerhq/hw-transport-webusb import
// import TransportWebHID from "@ledgerhq/hw-transport-webhid";

//Display the header in the div which has the ID "main"
// const initial = "<h1>Connect your Nano and open the Bitcoin app. Click anywhere to start...</h1>";
// const $main = document.getElementById("main");
// $main.innerHTML = initial;

// document.body.addEventListener("click", async () => {
//   $main.innerHTML = initial;
//   try {

//     // Keep if you chose the USB protocol
//     const transport = await TransportWebUSB.create();
//     console.log("I was able to connect");
//     // Keep if you chose the HID protocol
//    // const transport = await TransportWebHID.create();

//     //listen to the events which are sent by the Ledger packages in order to debug the app
//     listen(log => console.log(log))

//     //When the Ledger device connected it is trying to display the bitcoin address
//     const btc = new BTC({ transport, currency: "bitcoin" });
//     const { bitcoinAddress } = await btc.getWalletPublicKey(
//       "44'/0'/0'/0/0",
//       { verify: false, format: "legacy"}
//     );

//     //Display your bitcoin address on the screen
//     const h2 = document.createElement("h2");
//     h2.textContent = bitcoinAddress;
//     $main.innerHTML = "<h1>Your first Bitcoin address:</h1>";
//     $main.appendChild(h2);

//     //Display the address on the Ledger device and ask to verify the address
//     await appBtc.getWalletPublicKey("44'/0'/0'/0/0", {format:"legacy", verify: true});
//   } catch (e) {

//     //Catch any error thrown and displays it on the screen
//     const $err = document.createElement("code");
//     $err.style.color = "#f66";
//     $err.textContent = String(e.message || e);
//     $main.appendChild($err);
//   }
// });
// let ledgerTransport; 
let transport = null;
let appBtc = null;
document.getElementById('connectLedger').addEventListener('click', async function() {
    // Placeholder for Ledger connection logic
    // Replace with actual Ledger API call
    try{
        transport = await TransportWebUSB.create();
        console.log('Connecting to Ledger...');
        appBtc = new AppBtc({transport})
        // const ledgerTransport = await TransportWebUSB.create();
        console.log('Connected');
        listen(log => console.log(log))

       setTimeout(function() {
        document.getElementById('ledgerStatus').innerText = 'Ledger Connected';
        document.getElementById('getBTCAddress').style.display = 'block';
        document.getElementById('connectLedger').style.display = 'none';

        document.getElementById('signMessage').style.display = 'block';
    }, 1000);
    }catch (e) { 
        console.log(e);
    }
    
});

document.getElementById('getBTCAddress').addEventListener('click', async function() {
    // Add code to get BTC address from Ledger
    const { bitcoinAddress } =   await appBtc.getWalletPublicKey("49'/0'/1'/0/1", {format:"p2sh", verify: false});
    document.getElementById('ledgerAddress').innerText = bitcoinAddress;
    console.log("Getting BTC Address...");
});


document.getElementById('signBtn').addEventListener('click', async function() {
    const x = document.getElementById('message').value;
    console.log(x);
    const signature = await appBtc.signMessage("49'/0'/1'/0/1", Buffer.from(x).toString("hex")).then(function(result) {
        var v = result['v'] + 27 + 4;
        var signature = Buffer.from(v.toString(16) + result['r'] + result['s'], 'hex').toString('base64');
        console.log("Signature : " + signature);
        document.getElementById('signedMessage').value = signature;
        document.getElementById('verifySignature').style.display = 'block';

        }).catch(function(ex) {console.log(ex);});
        
    });
    document.getElementById('verifySignature').addEventListener('click', async function() {
        const { bitcoinAddress } =   await appBtc.getWalletPublicKey("49'/0'/1'/0/1", {format:"p2sh", verify: false});
        const signature = document.getElementById('signedMessage').value;
        console.log('sig' + signature);
        const message = "I am the owner of this key";
        //const x =  bitcoinMessage.verify(message, bitcoinAddress, signature[checkSegwitAlways]);
        const x =  Message(message).verify(bitcoinAddress, signature);
        console.log(x)
        if(x){
            document.getElementById('celebration').style.display = 'block';
        }else{
            document.getElementById('fail').style.display = 'block';

        }
    
    });