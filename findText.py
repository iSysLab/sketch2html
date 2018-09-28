from PIL import Image
import re
import cv2
import numpy as np
import pytesseract

width = 800
height = 600

def cleanText(origin_text):
    text = re.sub('[-=+,#/\?:^$.@*\"※~&%ㆍ!』\\‘|\(\)\[\]\<\>`\'…》]', '', origin_text)
    return text

def findText(img, mode = "default", offset = 10):
    # img = cv2.imread(img)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) #Converting to GrayScale
    text = cleanText(pytesseract.image_to_boxes(gray, config="--psm 11 --oem 1"))
    text = text.split("\n")
    array = []
    for m in text:
        info = m.split(" ")
        x1, y1, x2, y2 = int(info[1]) - offset, int(height - int(info[4])) - offset, int(info[3]) + offset, int(height - int(info[2])) + offset
        info = [info[0], [x1, y1, x2, y2]]
        array.append(info)
    index = 0
    if mode.lower() == "default":
        while index < len(array) - 1:
            if abs(array[index][1][1] - array[index + 1][1][1]) <= offset and abs(array[index][1][2] - array[index + 1][1][0]) <= 2 * offset:
                str = array[index][0] + array[index + 1][0]
                temp = [str, [int(array[index][1][0]), int(array[index][1][1]), int(array[index + 1][1][2]), int(array[index + 1][1][3])]]
                array[index] = temp
                array.pop(index + 1)
                index -= 1
            index += 1
    elif mode.lower() == "findpos":
        while index < len(array) - 1:
            if abs(array[index][1][1] - array[index + 1][1][1]) <= offset and abs(array[index][1][2] - array[index + 1][1][0]) <= 2 * offset:
                str = "ocrtext"
                temp = [str, [int(array[index][1][0]), int(array[index][1][1]), int(array[index + 1][1][2]), int(array[index + 1][1][3])]]
                array[index] = temp
                array.pop(index + 1)
                index -= 1
            index += 1
    # print(array)
    return array

if __name__=='__main__':
    textMser('onlyTextimg.jpg', "findword")
