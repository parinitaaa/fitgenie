npm init -y
<!--npm install express dotenv fs @google/generative-ai@latest-->
npm install express axios

ollama:
download ollama and install it
cmd: ollama --version    to check if it exists
     ollama pull llava
     ollama run llava    type something to get a response "describe the image"- itll prolly give some gibberish reply bc no image was given 
     ollama pull llava:7b

     ollama list   to see the models



to run backend: cd backend
                install the dependencies
                node server.js

