const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = './ml.proto'; // Replace with the actual path to your .proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const mlProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

server.addService(mlProto.MLService.service, {
  GetProcessingStatus: (call, callback) => {
    // Implement your logic for GetProcessingStatus here
    callback(null, { status: 'Your Status Here' });
  },
  UploadRawData: (call, callback) => {
    // Implement your logic for UploadRawData here
    callback(null, { message: 'Data Uploaded Successfully' });
  },
  // Add implementations for other RPC methods
});

const PORT_GRPC = 50051;
const HOST_GRPC = 'localhost';

server.bind(`${HOST_GRPC}:${PORT_GRPC}`, grpc.ServerCredentials.createInsecure());
console.log(`gRPC Server running at ${HOST_GRPC}:${PORT_GRPC}`);
server.start();
