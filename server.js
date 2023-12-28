
const express = require('express');
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

const packageDefinition = protoLoader.loadSync('ml.proto', {});
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const mlService = grpcObject.MLService;

const client = new mlService('0.0.0.0:50051', grpc.credentials.createInsecure());

app.use(cors()); 
app.use(bodyParser.json());


app.post('/api/getProcessingStatus', (req, res) => {
  const { token } = req.body;

  client.GetProcessingStatus({ token }, (error, response) => {
    if (error) {
      console.log(error)
      res.status(500).json({ error: 'Internal Server Error', error });
    } else {
      res.json(response);
    }
  });
});

app.post('/api/uploadRawData', (req, res) => {
  const { file, base64Files } = req.body;
  console.log('file',file)
  console.log('base64Files',base64Files)
  client.UploadRawData({ file, base64Files }, (error, response) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(response);
    }
  });
});

app.post('/api/command', (req, res) => {
  const { command, coordinates } = req.body;
  console.log(req.body)
  if (command === 'predict' && coordinates) {
    // Process and save the coordinates as needed
    console.log('Received Predict Command with Coordinates:', coordinates);
    res.json({ message: 'Prediction successful' });
  } else {
    res.status(400).json({ error: 'Invalid request' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
