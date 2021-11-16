# epd-playground-demo
Simple Demo App for demonstrating how to use EPD Playground with the Mobile Access Gateway.

## Setup
Node and npm have to be installed on your machine. To download the repo from github, use
`git clone https://github.com/heg2/epd-playground-demo` in your terminal.<br />
Then change directory with `cd epd-playground-demo` and install the dependencies using `npm i`.<br />
Before running for the first time, you have to `npm run build`.

## Running
You can run the app locally with entering `npm run dev` to your terminal (when in the directory of this README file). Keep the terminal window running and open `http://localhost:3000` in your browser.<br />
You may use the inspect mode of your browser for seeing additional details in the browser console.

## Note concerning creation of demo patient data
The app uses the Patient Generator for creating demo patients. For this feature to work, you need to be connected to the BFH TI network in Biel, either locally or via VPN.