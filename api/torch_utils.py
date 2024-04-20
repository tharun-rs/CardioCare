import torch
import torch.nn as nn
import torchvision.transforms as transforms
from PIL import Image
from torchvision.models import alexnet
import io

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

    