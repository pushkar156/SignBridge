import os
os.environ['CUDA_VISIBLE_DEVICES'] = '-1'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

import numpy as np
from tensorflow import keras

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
H5_PATH = os.path.join(SCRIPT_DIR, "signbridge_model_v1.h5")
NPZ_PATH = os.path.join(SCRIPT_DIR, "signbridge_weights.npz")

def relu(x):
    return np.maximum(0, x)

def softmax(x):
    e_x = np.exp(x - np.max(x, axis=-1, keepdims=True))
    return e_x / np.sum(e_x, axis=-1, keepdims=True)

def main():
    print(f"Loading {H5_PATH} ...")
    model = keras.models.load_model(H5_PATH)
    
    weights_dict = {}
    epsilons = {}
    for layer in model.layers:
        weights = layer.get_weights()
        if not weights:
            continue
        if 'dense' in layer.name:
            weights_dict[f"{layer.name}_W"] = weights[0]
            weights_dict[f"{layer.name}_b"] = weights[1]
        elif 'batch_normalization' in layer.name:
            weights_dict[f"{layer.name}_gamma"] = weights[0]
            weights_dict[f"{layer.name}_beta"] = weights[1]
            weights_dict[f"{layer.name}_mean"] = weights[2]
            weights_dict[f"{layer.name}_var"] = weights[3]
            epsilons[f"{layer.name}_eps"] = np.array([layer.epsilon], dtype=np.float32)

    weights_dict.update(epsilons)
    np.savez_compressed(NPZ_PATH, **weights_dict)
    print(f"Exported numpy weights to {NPZ_PATH} ({os.path.getsize(NPZ_PATH) / 1024:.1f} KB)")

    # Verify Numpy inference against Keras prediction
    sample_input = np.random.uniform(-1, 1, (1, 84)).astype(np.float32)
    keras_pred = model.predict(sample_input, verbose=0)[0]
    
    # Numpy Forward Pass
    data = np.load(NPZ_PATH)
    x = sample_input
    
    # Layer 1: Dense (Relu) -> BN -> Dropout
    w1, b1 = data['dense_W'], data['dense_b']
    g1, beta1, m1, v1 = data['batch_normalization_gamma'], data['batch_normalization_beta'], data['batch_normalization_mean'], data['batch_normalization_var']
    eps1 = data['batch_normalization_eps'][0]
    x = relu(np.dot(x, w1) + b1)
    x = g1 * (x - m1) / np.sqrt(v1 + eps1) + beta1
    
    # Layer 2: Dense (Relu) -> BN -> Dropout
    w2, b2 = data['dense_1_W'], data['dense_1_b']
    g2, beta2, m2, v2 = data['batch_normalization_1_gamma'], data['batch_normalization_1_beta'], data['batch_normalization_1_mean'], data['batch_normalization_1_var']
    eps2 = data['batch_normalization_1_eps'][0]
    x = relu(np.dot(x, w2) + b2)
    x = g2 * (x - m2) / np.sqrt(v2 + eps2) + beta2

    # Layer 3: Dense (Relu) -> BN -> Dropout
    w3, b3 = data['dense_2_W'], data['dense_2_b']
    g3, beta3, m3, v3 = data['batch_normalization_2_gamma'], data['batch_normalization_2_beta'], data['batch_normalization_2_mean'], data['batch_normalization_2_var']
    eps3 = data['batch_normalization_2_eps'][0]
    x = relu(np.dot(x, w3) + b3)
    x = g3 * (x - m3) / np.sqrt(v3 + eps3) + beta3

    # Layer 4: Output Dense -> Softmax
    w4, b4 = data['dense_3_W'], data['dense_3_b']
    x = np.dot(x, w4) + b4
    np_pred = softmax(x)[0]
    
    diff = np.max(np.abs(keras_pred - np_pred))
    print(f"Max absolute difference between Keras and Numpy inference: {diff:.8f}")
    if diff < 1e-4:
        print("MATCH PERFECT! Numpy MLP Inference is 100% accurate!")

if __name__ == "__main__":
    main()
