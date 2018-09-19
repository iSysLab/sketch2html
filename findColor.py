import cv2
import numpy as np
import operator

class FindColor():
    def __init__(self):
        self.lower_red = np.array([0, 200, 200]) # red
        self.upper_red = np.array([10, 255, 255])

        self.lower_blue = np.array([115, 200, 200])  # blue
        self.upper_blue = np.array([125, 255, 255])

        self.lower_yellow = np.array([25, 200, 200])  # yellow
        self.upper_yellow = np.array([35, 255, 255])

        self.lower_green = np.array([55, 200, 125])  # green
        self.upper_green = np.array([65, 255, 135])

        self.lower_black = np.array([0, 0, 0])  # black
        self.upper_black = np.array([5, 5, 5])

        self.img=None

    def run(self,img):
        self.img = img
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        redValue, redContour = self.detector(hsv, self.lower_red, self.upper_red)
        blueValue, blueContour = self.detector(hsv, self.lower_blue, self.upper_blue)
        yellowValue, yellowContour = self.detector(hsv, self.lower_yellow, self.upper_yellow)
        greenValue, greenContour = self.detector(hsv, self.lower_green, self.upper_green)
        blackValue, blackContour = self.detector(hsv, self.lower_black, self.upper_black)
        d = {'btn btn-danger':redValue,'btn btn-primary':blueValue,'btn btn-warning':yellowValue,'btn btn-success':greenValue}
        result = max(d.keys(), key=lambda x: d[x])
        print(d)
        if d[result]>100:
            return result
        else:
            return "none"

    def detector(self,hsv,lower,upper):
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
                proposalContour.append(contour)#번호판으로 추정되는 제안 영역

        return maximumArea,bestContour

    def paint(self,bestContour):
        x, y, w, h = cv2.boundingRect(bestContour)
        cv2.rectangle(self.img, (x, y), (x + w, y + h), (255, 0, 0), 2)
        #cv2.imshow("Frame", self.img)
        cv2.imwrite('redr.jpg', self.img)

if __name__ =='__main__':
    img = cv2.imread("red.PNG")
    FindColor = FindColor()

    returnValue=FindColor.run(img)

    cv2.waitKey(0)
    cv2.destroyAllWindows()