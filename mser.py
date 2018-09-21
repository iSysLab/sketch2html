from PIL import Image
import cv2
import random
import numpy as np

def mser(roi_img):
    ## Read image and change the color space
    img = roi_img
    vis = img.copy()
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    _, viss = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY_INV)
    # cv2.imwrite("html/" + 'view0.jpg', viss)
    e = cv2.getStructuringElement(cv2.MORPH_RECT, (10, 1))
    viss = cv2.dilate(viss, e, iterations=1)
    # cv2.imwrite("html/" + 'view1.jpg', viss)
    e = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 5))
    viss = cv2.erode(viss, e, iterations=1)
    # cv2.imwrite("html/" + 'view2.jpg', viss)
    e = cv2.getStructuringElement(cv2.MORPH_RECT, (20, 1))
    viss = cv2.dilate(viss, e, iterations=3)
    # cv2.imwrite("html/" + 'view3.jpg', viss)

    viss, contours, hierarchy = cv2.findContours(viss, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    viss = cv2.drawContours(viss, contours, -1, (255, 255, 255), 2)

    return len(contours)
