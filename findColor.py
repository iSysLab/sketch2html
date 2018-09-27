import cv2
import numpy as np
import operator

class FindColor():
    def __init__(self):
        self.lower_red = np.array([0, 50, 50]) # red
        self.upper_red = np.array([10, 255, 255])

        self.lower_blue = np.array([115, 50, 50])  # blue
        self.upper_blue = np.array([125, 255, 255])

        self.lower_yellow = np.array([25, 50, 50])  # yellow
        self.upper_yellow = np.array([35, 255, 255])

        self.lower_green = np.array([55, 50, 50])  # green
        self.upper_green = np.array([65, 255, 255])

        self.lower_black = np.array([0, 0, 0])  # black
        self.upper_black = np.array([5, 5, 5])

        self.img=None

    def run(self, img, wedget):
        self.img = img
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        redValue, redContour = self.detector(hsv, self.lower_red, self.upper_red)
        blueValue, blueContour = self.detector(hsv, self.lower_blue, self.upper_blue)
        yellowValue, yellowContour = self.detector(hsv, self.lower_yellow, self.upper_yellow)
        greenValue, greenContour = self.detector(hsv, self.lower_green, self.upper_green)
        # blackValue, blackContour = self.detector(hsv, self.lower_black, self.upper_black)
        if wedget == "button":
            d = {'btn btn-danger':redValue,'btn btn-primary':blueValue,'btn btn-warning':yellowValue,'btn btn-success':greenValue}
            background_color = max(d.keys(), key=lambda x: d[x])
            if d[background_color]>10:
                return background_color
            else:
                return "none"
        else:
            d = {'#ff6666':redValue,'#0099ff':blueValue,'#ffeb99':yellowValue,'#33cc33':greenValue}
            d_ = {'red':redValue,'blue':blueValue,'orange':yellowValue,'#009933':greenValue}
            border_color = max(d.keys(), key=lambda x: d[x])
            focus_color = max(d_.keys(), key=lambda x: d_[x])
            if d[border_color]>10:
                return border_color, focus_color
            else:
                return "none", "none"

    def detector(self, hsv, lower, upper):
        mask = cv2.inRange(hsv, lower, upper)
        element = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
        mask = cv2.erode(mask, element, iterations=1)
        mask = cv2.dilate(mask, element, iterations=4)

        cnts = cv2.findContours(mask.copy(), cv2.RETR_EXTERNAL,
                                cv2.CHAIN_APPROX_SIMPLE)[-2]
        maximumArea = 0
        bestContour = None
        proposalContour=[]
        for contour in cnts:
            currentArea = cv2.contourArea(contour)
            if currentArea > maximumArea:
                bestContour = contour
                maximumArea = currentArea
                proposalContour.append(contour)# 검출로 판단되는 제안 영역
        return maximumArea,bestContour

'''
    def paint(self,bestContour):# 검출영역 그리기
        x, y, w, h = cv2.boundingRect(bestContour)
        cv2.rectangle(self.img, (x, y), (x + w, y + h), (255, 0, 0), 2)
        #cv2.imshow("Frame", self.img)
        cv2.imwrite('redr.jpg', self.img)
'''

if __name__ =='__main__':
    img = cv2.imread("images/origin.jpg")
    FindColor = FindColor()

    returnValue=FindColor.run(img)

    cv2.waitKey(0)
    cv2.destroyAllWindows()
