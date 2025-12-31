# Likewise Learn

This is the frontend code for Likewise Learn alongside the TensorFlow model for engagement rate prediction. It is a React project set up with Vite for fast compiling/serving.

## Model info
The model files can be found in public/models/v0.8js. It is a TensorFlow Keras sequential model that has been converted to TensorFlow JS for client-side use. It contains a batch-normalization input layer that takes a 770-element embedding vector, 16 hidden layers following a batch-normalization/dense/dropout pattern (to reduce overfitting), and an output layer using sigmoid activation to return an engagement rate proportion of interactions to views. The first and last dense layers contain 256 neurons, while the dense layers in between contain 512.
