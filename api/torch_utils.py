import torch
import torch.nn as nn
import torchvision.transforms as transforms
from PIL import Image
from torchvision.models import alexnet
import io
import cv2
import numpy as np

#load the model
model = alexnet()
num_ftrs = model.classifier[6].in_features
num_classes = 4
model.classifier[6] = nn.Linear(num_ftrs, num_classes)
model.load_state_dict(torch.load('../Model/advtrained.pth', map_location=torch.device('cpu')))
model.eval()


def transform_image(image_bytes):
    transform = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])])
    
    image = Image.open(io.BytesIO(image_bytes))
    return transform(image).unsqueeze(0)

def get_prediction(image_tensor):
    output = model(image_tensor)
    _, predicted = torch.max(output.data, 1)
    return predicted



def is_ecg(uploaded_image, reference_image='./reference_ecg.jpg', threshold=0.2):
    nparr = np.frombuffer(uploaded_image, np.uint8)
    uploaded_img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    reference_img = cv2.imread(reference_image, cv2.IMREAD_GRAYSCALE)
    sift = cv2.SIFT_create()
    kp1, des1 = sift.detectAndCompute(reference_img, None)
    kp2, des2 = sift.detectAndCompute(uploaded_img, None)
    flann = cv2.FlannBasedMatcher(dict(algorithm=1, trees=5), dict(checks=50))

    matches = flann.knnMatch(des1, des2, k=2)

    good_matches = []
    for m, n in matches:
        if m.distance < 0.7 * n.distance:
            good_matches.append(m)

    similarity_score = len(good_matches) / len(kp1)

    return similarity_score > threshold

    