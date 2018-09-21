import glob
from PIL import Image
class ImageMerge:
    def __init__(self):
        self.maxX=0
        self.resetX = 0
        self.addY = 0
        self.newImage = Image.new("RGB", (800, 600), (256, 256, 256))
    def merge(self,dir,saveDir,fileName):
        x1=0
        target_dir = dir
        files = glob.glob(target_dir + "*.*")
        y = Image.open(files[0])
        x = y.size[0]
        y = y.size[1]
        positionList=[]
        for index in range(len(files)):
            image = Image.open(files[index])
            self.maxX += x
            if self.maxX+x > 800:
                self.maxX = 0
                self.resetX += x1 + x
                self.addY += y
            x1 = index * x - self.resetX
            y1 = 0 + self.addY
            x2 = x * (index + 1) - self.resetX
            y2 = y + self.addY
            if y2> 600:
                #print(index)
                break
            #print(x1, y1, x2, y2)
            area = (x1, y1, x2, y2)  # (x1,y1,x2,y2)순서
            positionList.append([x1, y1, x2, y2])
            self.newImage.paste(image, area)
        self.newImage.save(saveDir+fileName+".png", "PNG")

        return fileName,positionList

if __name__=='__main__':
    imgMerge= ImageMerge()
    fileName,position = imgMerge.merge("./warehouse/preview/", "./warehouse/", "result")

    print(fileName)
    print(position)